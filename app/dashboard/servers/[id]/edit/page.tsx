import React from "react";
import { serverClient } from "@/trpc/serverClient";
import EditServerForm from "@/app/dashboard/servers/[id]/edit/edit-server-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Edit server",
};

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const server = await serverClient.servers.get(id);
  if (!server) return "Server not found!";
  return <EditServerForm server={server} />;
};

export default Page;
