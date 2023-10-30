import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { subDays } from "date-fns";

export const GET = async () => {
  const serverId = "652f10442bcf94c7fd370502";
  const statistic = await prisma.statistic.findFirst({
    where: {
      serverId,
      createdAt: { gte: subDays(Date.now(), 3) },
    },
  });

  if (!statistic) {
    await prisma.statistic.create({
      data: { serverId, records: { downloads: 0, uploads: 0 } },
    });
  } else {
    await prisma.statistic.update({
      where: { id: statistic.id },
      data: { records: { push: { downloads: 0, uploads: 0 } } },
    });
  }

  return NextResponse.json({ message: "Completed" });
};
