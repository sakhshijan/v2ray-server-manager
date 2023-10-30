import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { MainNav } from "@/app/dashboard/main-nav";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");
  return (
    <div className="container flex min-h-screen flex-col !p-0">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4"></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-8">{children}</div>
      <Separator />
      <footer
        className={
          "flex flex-col gap-2 px-4 py-2 text-center text-xs text-muted-foreground"
        }
      >
        This is just for private usage, dont share account credentials with no
        one! @ 2023
      </footer>
    </div>
  );
};

export default DashboardLayout;
