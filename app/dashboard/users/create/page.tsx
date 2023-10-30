import React from "react";
import CreateUserForm from "@/app/dashboard/users/create/create-user-form";
import { serverClient } from "@/trpc/serverClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Create new user account",
};

const Page = async () => {
  const servers = await serverClient.servers.list({ isActive: true });
  return <CreateUserForm servers={servers} />;
};

export default Page;
