import { protectedProcedure, router } from "@/server/trcp";
import {
  createUserSchema,
  objectIdSchema,
  rechargeUserSchema,
} from "@/schemas";
import prisma from "@/prisma/prisma";
import { TRPCError } from "@trpc/server";
import { VpsServer } from "@/VpsServer";
import { hash } from "bcrypt-ts";
import { addDays } from "date-fns";
import { Services } from "@/consts";
import { gbToByte } from "@/lib/utils";
import { z } from "zod";
import { InboundConfig } from "@/lib/inboundConfig";
import { Service, User } from "@prisma/client";

export const usersRoutes = router({
  list: protectedProcedure.query(async () =>
    prisma.user.findMany({
      where: {
        isAdmin: false,
      },
      orderBy: { id: "asc" },
      include: {
        services: { where: { isActive: true }, include: { server: true } },
      },
    }),
  ),
  get: protectedProcedure
    .input(z.string().length(24))
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { id: input },
        include: {
          services: { where: { isActive: true }, include: { server: true } },
        },
      });
    }),
  getWithAnyService: protectedProcedure
    .input(z.string().length(24))
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { id: input },
        include: {
          services: { orderBy: { id: "desc" }, include: { server: true } },
        },
      });
    }),
  create: protectedProcedure
    .input(async (input: any) => {
      const { username } = input;
      const user = await prisma.user.findUnique({ where: { username } });
      if (user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exist!",
        });
      return input;
    })
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { serverId } = input;
      const server = await prisma.server.findUnique({
        where: { id: serverId, isActive: true },
      });
      if (!server) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Server not found!",
        });
      }

      const provider = new VpsServer(server);

      const { username, service, ...serviceData } = input;
      const selectedService = Services.find(({ id }) => id === service)!;
      const createdUser = await prisma.user.create({
        data: {
          username,
          subsetId: user.id,
          password: await hash("Password", 10),
          services: {
            create: {
              ...serviceData,
              total: gbToByte(selectedService.volume),
              expire: addDays(Date.now(), selectedService.time + 1),
              name: selectedService.name,
            },
          },
        },
        include: {
          services: true,
        },
      });
      const { success: addUserSuccess } = await provider.addUser(
        serviceData.inbound,
        userToClient(createdUser),
      );

      if (!addUserSuccess)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Servers error!",
        });
      return createdUser;
    }),
  getAndUpdateUserStats: protectedProcedure
    .input(z.string().length(24))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input },
        include: {
          services: { where: { isActive: true }, include: { server: true } },
        },
      });
      if (!user || !user.services || user?.services?.length < 1)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This user dont have any active service!",
        });
      const [activeService] = user.services;
      const provider = new VpsServer(activeService.server);

      const userClient = await provider.userTraffic(user.username);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          services: {
            update: {
              data: {
                download: userClient.down,
                upload: userClient.up,
              },
              where: { id: activeService.id },
            },
          },
        },
        include: {
          services: {
            where: { id: activeService.id },
            include: { server: true },
          },
        },
      });

      const inbound = await provider.getInbound(activeService.inbound);
      const inboundConfig = new InboundConfig(user, inbound, activeService);
      const config = inboundConfig.getConfigs();

      return {
        user: updatedUser,
        inbound,
        config,
      };
    }),
  paginated: protectedProcedure
    .input(z.object({ page: z.coerce.number().gte(1).default(1) }))
    .query(async ({ input }) => {
      return prisma.user.findMany({
        where: {
          isAdmin: false,
        },
        orderBy: { id: "desc" },
        include: {
          services: { where: { isActive: true }, include: { server: true } },
        },
        take: 10,
        skip: (input.page - 1) * 10,
      });
    }),
  recharge: protectedProcedure
    .input(rechargeUserSchema)
    .mutation(async ({ input }) => {
      const selectedService = Services.find(({ id }) => id === +input.service);
      const newServer = await prisma.server.findUnique({
        where: { id: input.serverId, isActive: true },
      });
      if (!newServer)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Server not found!",
        });
      if (!selectedService)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found!",
        });

      const user = await prisma.user.findUnique({
        where: { id: input.id },
        include: {
          services: {
            where: { isActive: true },
            include: { server: true },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
      }
      const { services } = user;

      const newProvider = new VpsServer(newServer);

      //new service
      if (!services || services.length <= 0) {
        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: {
            services: {
              create: {
                isActive: true,
                name: selectedService.name,
                total: gbToByte(selectedService.volume),
                expire: addDays(Date.now(), selectedService.time + 1),
                inbound: input.inbound,
                serverId: input.serverId,
              },
              updateMany: {
                where: { isActive: true, userId: input.id },
                data: { isActive: false },
              },
            },
          },
          include: {
            services: { where: { isActive: true }, include: { server: true } },
          },
        });
        const activeService = user?.services.at(0)!;
        const { success, msg } = await newProvider.addUser(
          activeService.inbound,
          userToClient(updatedUser),
        );
        if (!success) {
          await prisma.service.delete({ where: { id: activeService.id } });
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
        }
        return updatedUser;
      }
      const activeService = services.at(0);

      //has a service
      if (!activeService)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "A service should exist, but it dose-nt!",
        });

      //if the server didnt changed.
      if (activeService.serverId === input.serverId) {
        const { up, down } = await newProvider.userTraffic(user.username);
        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: {
            services: {
              update: {
                where: {
                  id: activeService.id,
                  isActive: true,
                },
                data: {
                  isActive: false,
                  download: down,
                  upload: up,
                  end: new Date(),
                },
              },
              create: {
                isActive: true,
                inbound: input.inbound,
                serverId: activeService.serverId,
                expire: addDays(Date.now(), selectedService.time),
                total: gbToByte(selectedService.volume),
                name: selectedService.name,
              },
            },
          },
          include: { services: { where: { isActive: true } } },
        });

        if (!updatedUser.services)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An error in server!",
          });
        //if inbound didnt changed
        if (activeService.inbound === updatedUser.services.at(0)?.inbound) {
          const { success, msg } = await newProvider.resetTraffic(
            activeService.inbound,
            user.username,
          );

          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: msg,
            });
          }
          const { success: successUpdate, msg: updatedMsg } =
            await newProvider.updateUser(
              activeService.inbound,
              userToClient(updatedUser),
            );
          if (!successUpdate) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: updatedMsg,
            });
          }
          return updatedUser;
        } else {
          const { success, msg } = await newProvider.deleteUser(
            user.secret,
            activeService.inbound,
          );

          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: msg,
            });
          }
          const { success: successAdded, msg: addedMsg } =
            await newProvider.addUser(input.inbound, userToClient(updatedUser));
          if (!successAdded) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: addedMsg,
            });
          }
          return updatedUser;
        }
      }
    }),
  search: protectedProcedure
    .input(z.string().or(z.undefined()))
    .query(async ({ input }) => {
      return prisma.user.findMany({
        where: { username: { contains: input }, isAdmin: false },
        take: 5,
      });
    }),
  history: protectedProcedure.input(objectIdSchema).query(async ({ input }) => {
    return prisma.user.findUnique({
      where: { id: input },
      include: { services: { include: { server: true } } },
    });
  }),
});

function userToClient(user: User & { services: Service[] }) {
  const service = user.services.at(0)!;
  return {
    id: user.secret,
    email: user.username,
    enable: true,
    subId: user.secret + "sub",
    tgId: "",
    totalGB: Number(service.total),
    expiryTime: service.expire.getTime() || 0,
  };
}
