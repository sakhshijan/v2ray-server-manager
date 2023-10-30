import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Computer, Database, Microscope, Users } from "lucide-react";
import { NewAccounts } from "@/app/dashboard/new-accounts";
import { Overview } from "@/app/dashboard/overview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "V2ray servers manager - Dashboard",
};

const Page = () => {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Server
              </CardTitle>
              <Computer className="opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 Server</div>
              <p className="text-xs text-muted-foreground">5 Active Server</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                2100 Active Account
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Test Account
              </CardTitle>
              <Microscope className="opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+970</div>
              <p className="text-xs text-muted-foreground">
                +971 Test Account Created so far
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Traffic</CardTitle>
              <Database className="opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+680 GB</div>
              <p className="text-xs text-muted-foreground">
                689 GB Data Transferred so far
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>New Accounts</CardTitle>
              <CardDescription>The Last 5 Accounts Created</CardDescription>
            </CardHeader>
            <CardContent>
              <NewAccounts />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
