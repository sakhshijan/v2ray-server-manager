import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const t = initTRPC.create({ transformer: superjson });

const authorized = t.middleware(async ({ next }) => {
  const { user } = (await getServerSession(authOptions)) as any;
  if (!user || !user.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user,
    },
  });
});
export const protectedProcedure = t.procedure.use(authorized);
export const publicProcedure = t.procedure;
export const router = t.router;
