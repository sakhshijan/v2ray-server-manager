import React from "react";
import prisma from "@/prisma/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DownloadCloud,
  PlusCircle,
  ServerIcon,
  UploadCloud,
  Verified,
} from "lucide-react";
import { Service } from "@prisma/client";
import { Server } from ".prisma/client";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { byteToGB, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - User services history",
};

const Page = async ({ params }: { params: { id: string } }) => {
  const services = await prisma.service.findMany({
    where: { userId: params.id },
    include: { server: true },
  });
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Services</h2>
          <p className="text-muted-foreground">
            This is a list of all services user had.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <UserServiceCard service={service} key={service.id} />
        ))}
        <Link
          href={`/dashboard/users/${params.id}/recharge`}
          className="flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed font-bold opacity-50 transition-all duration-300 hover:opacity-80"
        >
          <PlusCircle size={64} />
          Add or Change Service!
        </Link>
      </div>
    </div>
  );
};

export default Page;

function UserServiceCard({
  service,
}: {
  service: Service & { server: Server };
}) {
  const details = [
    { key: "Expire in", value: format(service.expire, "yy/M/dd") },
  ];
  if (service.end)
    details.push({
      key: "Ended in",
      value: format(service.end, "yy/M/dd"),
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="flex flex-col">
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>
            Started {format(service.start, "yyyy/M/d")}
          </CardDescription>
        </div>
        <Verified
          strokeWidth={2}
          size={26}
          className={cn("ml-auto", {
            hidden: !service.isActive,
          })}
        />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <ServerIcon />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {service.server.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {service.server.location.countryName} - {service.server.ip}
            </p>
          </div>
        </div>
        <div>
          {details.map((value) => (
            <div
              key={value.key}
              className="mb-1 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{value.key}</p>
                <p className="text-sm text-muted-foreground">{value.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {!service.isActive && (
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div className="flex items-center gap-2 font-medium">
              {byteToGB(service.download).toFixed(2)} GB
              <DownloadCloud size={16} />
            </div>
            <Separator orientation="vertical" />
            <div className="flex items-center gap-2 font-medium">
              {byteToGB(service.upload).toFixed(2)} GB
              <UploadCloud size={16} />
            </div>
          </div>
        )}
        {service.isActive && (
          <Button size="sm" variant="secondary">
            End This
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
