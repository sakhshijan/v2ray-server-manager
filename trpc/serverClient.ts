import { appRouter } from "@/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const serverClient = appRouter.createCaller({
  // links: [httpBatchLink({ url: getBaseUrl() + "/api/trpc" })],
});
