import { router } from "@/server/trcp";
import { serversRoutes } from "@/server/routes/servers";
import { usersRoutes } from "@/server/routes/users";
import { providersRoutes } from "@/server/routes/providers";

export const appRouter = router({
  servers: serversRoutes,
  users: usersRoutes,
  providers: providersRoutes,
});
export type AppRouter = typeof appRouter;
