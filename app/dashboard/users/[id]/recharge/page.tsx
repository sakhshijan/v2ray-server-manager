import React from "react";
import CreateUserForm from "@/app/dashboard/users/create/create-user-form";
import { serverClient } from "@/trpc/serverClient";
import RechargeUserForm from "@/app/dashboard/users/[id]/recharge/recharge-user-form";
import { VpsServer } from "@/VpsServer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Recharge user account",
};

const Recharge = async ({ params }: { params: { id: string } }) => {
  const [servers, user] = await Promise.all([
    serverClient.servers.list({ isActive: true }),
    serverClient.users.getWithAnyService(params.id),
  ]);
  if (!user) return "Nothing found!";

  if (user.services && user.services.at(0)) {
    const provider = new VpsServer(user.services[0].server);
    const inbounds = await provider.getInbounds();
    return (
      <RechargeUserForm servers={servers} user={user} inbounds={inbounds} />
    );
  }

  return <RechargeUserForm servers={servers} user={user} />;
};

export default Recharge;
