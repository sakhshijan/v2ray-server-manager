import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { byteToGB, cn } from "@/lib/utils";

import {
  Activity,
  ArrowDownUp,
  Clock,
  DownloadCloud,
  History,
  LinkIcon,
  Package2,
  RotateCw,
  Server,
  UploadCloud,
  User,
  Verified,
} from "lucide-react";
import { CopyConfigsButton } from "@/app/dashboard/users/[id]/view/copy-configs-button";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { serverClient } from "@/trpc/serverClient";
import { QrCodeComponent } from "./qr-code-component";
import { Button, buttonVariants } from "@/components/ui/button";
import SelectedService from "@/components/selected-service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Account status",
};

const Page = async ({ params }: any) => {
  const { user, inbound, config } =
    await serverClient.users.getAndUpdateUserStats(params.id);

  if (!user) return "Not found!";
  if (user.services.length < 1) return "User not connected to any server!";
  const [activeService] = user.services;

  const downloadGb = byteToGB(activeService.download);
  const uploadGb = byteToGB(activeService.upload);
  const totalGb = byteToGB(activeService.total);
  const leftGb = totalGb - downloadGb + uploadGb;

  const service = [
    {
      title: "Username",
      info: "The username",
      icon: <User className="opacity-50" />,
      text: user.username,
    },
    {
      title: "Server",
      info: "The server user connecting to.",
      icon: <Server className="opacity-50" />,
      text: (
        <div className="flex items-center gap-2">
          {activeService.server.name}
          <Link href={"/dashboard"}>
            <LinkIcon size={18} strokeWidth={4} />
          </Link>
        </div>
      ),
    },
    {
      title: "Service",
      info: "Current service user have active.",
      icon: <Package2 className="opacity-50" />,
      text: activeService.name,
    },
    {
      title: "Total Volume",
      info: `Total volume available in this pack.`,
      icon: <ArrowDownUp className="opacity-50" />,
      text: `${totalGb} GB`,
    },
    {
      title: "Times left",
      info: `Days of service.`,
      icon: <Clock className="opacity-50" />,
      text: formatDistance(Date.now(), activeService.expire),
    },
  ];

  const details = [
    {
      title: "Volume left to use",
      info: `Used ${(((uploadGb + downloadGb) / totalGb) * 100).toFixed(
        2,
      )}% of total.`,
      icon: <Activity className="opacity-50" />,
      text: `${leftGb.toFixed(2)} GB`,
    },
    {
      title: "Uploads",
      info: `${Number((uploadGb / totalGb) * 100).toFixed(2)}%`,
      icon: <UploadCloud className="opacity-50" />,
      text: `${uploadGb.toFixed(2)} GB`,
    },
    {
      title: "Downloads",
      info: `${Number(Number(downloadGb / totalGb) * 100).toFixed(2)}%`,
      icon: <DownloadCloud className="opacity-50" />,
      text: `${downloadGb.toFixed(2)} GB`,
    },
  ];
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User</h3>
          <p className="text-sm text-muted-foreground">Account details</p>
        </div>
        <div>
          <div className="flex gap-2 font-bold">
            <Verified /> {activeService.name}
          </div>
          <p className="text-end opacity-50">{inbound.protocol}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        {service.map((value) => (
          <Card
            className={
              "col-span-4 first:col-span-6 [&:nth-child(2)]:col-span-6"
            }
            key={value.title}
          >
            <CardHeader className="flex flex-row items-center  justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {value.title}
              </CardTitle>
              {value.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.text}</div>
              <p className="text-xs text-muted-foreground">{value.info}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {details.map((value) => (
          <Card key={value.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {value.title}
              </CardTitle>
              {value.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.text}</div>
              <p className="text-xs text-muted-foreground">{value.info}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <QrCodeComponent config={config || ""} />
        <CopyConfigsButton configs={config || ""} />
        <Link
          href={`/dashboard/users/${user.id}/recharge`}
          className={cn(buttonVariants({ variant: "outline" }), "flex gap-2")}
        >
          <RotateCw size={16} /> Change Service
        </Link>
        <Link
          href={`/dashboard/users/${user.id}/history`}
          className={cn(buttonVariants({ variant: "outline" }), "flex gap-2")}
        >
          <History size={16} /> Service History
        </Link>
      </div>
    </div>
  );
};

export default Page;
