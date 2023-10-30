import { protectedProcedure, router } from "@/server/trcp";
import { z } from "zod";
import prisma from "@/prisma/prisma";
import { TRPCError } from "@trpc/server";
import { VpsServer } from "@/VpsServer";

export const providersRoutes = router({
  inbounds: protectedProcedure
    .input(z.string().length(24))
    .query(async ({ input }) => {
      const server = await prisma.server.findUnique({ where: { id: input } });
      if (!server) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const provider = new VpsServer(server);

      return provider.getInbounds();
    }),
});
