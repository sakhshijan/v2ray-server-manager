import { protectedProcedure, router } from "@/server/trcp";
import {
  createServerSchema,
  editServerSchema,
  getServersListFilterSchema,
  objectIdSchema,
} from "@/schemas";
import { getIpLocation } from "@/lib/getIpLocation";
import prisma from "@/prisma/prisma";
import { TRPCError } from "@trpc/server";
import { VpsServer } from "@/VpsServer";

export const serversRoutes = router({
  get: protectedProcedure.input(objectIdSchema).query(async ({ input }) => {
    return prisma.server.findUnique({
      where: { id: input },
      select: {
        username: false,
        password: false,
        id: true,
        ip: true,
        domain: true,
        name: true,
        path: true,
        port: true,
        isActive: true,
      },
    });
  }),
  list: protectedProcedure
    .input(getServersListFilterSchema)
    .query(async ({ input }) => {
      const { includeServersCount, ...query } = input || {};
      return prisma.server.findMany({
        include: {
          _count: includeServersCount && {
            select: { services: { where: { isActive: true } } },
          },
        },
        where: {
          ...query,
        },
      });
    }),
  create: protectedProcedure
    .input(async (input: any) => {
      const provider = new VpsServer(input);
      const { success } = await provider.signIn();
      if (!success)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot create a server with wrong credentials!",
        });
      input.accessToken = provider.accessToken;
      return input;
    })
    .input(createServerSchema)
    .mutation(async ({ input, ctx }) => {
      const { version, countryCode, city, timezone, region, countryName } =
        await getIpLocation(input.ip);
      return prisma.server.create({
        data: {
          ...input,
          ipVersion: version,
          location: {
            countryName,
            timezone,
            region,
            countryCode,
            city,
          },
        },
      });
    }),
  edit: protectedProcedure
    .input(editServerSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.server.update({ where: { id }, data });
    }),
});
