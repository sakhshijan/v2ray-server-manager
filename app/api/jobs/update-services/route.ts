import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { VpsServer } from "@/VpsServer";
import { encodeString } from "@/lib/hasing";

/*
 *
 * this route made to call by a cron job for a specification rate time. this is a heavy query action
 * so make sure you are using it in a right time
 * also this is a protected route, you have to set header Authorization key same as CRON_SECRET from env
 *
 * this is a required action to keep update servers token to make any other request during use
 * */

export async function GET(request: Request) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  const servers = await prisma.server.findMany({ where: { isActive: true } });

  await Promise.all(
    servers.map(async (server) => {
      const provider = new VpsServer(server);
      const { success } = await provider.signIn();
      if (!success)
        throw new Error(
          "An active server has wrong credentials!, " + server.ip,
        );
      return prisma.server.update({
        where: { id: server.id },
        data: { accessToken: encodeString(provider.accessToken as string) },
      });
    }),
  );

  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: { server: true, user: true },
  });

  const result = await Promise.all(
    services.map(async (service) => {
      const provider = new VpsServer(service.server);
      const { down, up, enable } = await provider.userTraffic(
        service.user.username,
      );
      return prisma.service.update({
        where: { id: service.id },
        data: {
          download: down,
          upload: up,
          isActive: enable,
          end: enable ? undefined : new Date(),
        },
      });
    }),
  );
  console.info(result);

  return NextResponse.json({ Action: "Completed" });
}
