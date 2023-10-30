import { serverClient } from "@/trpc/serverClient";
import Link from "next/link";
import { byteToGB, cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchUserDialog } from "@/app/dashboard/users/search-dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Users list",
};

export default async function Users({ searchParams }: any) {
  const users = await serverClient.users.paginated({ page: searchParams.page });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manager Users</h2>
          <p className="text-muted-foreground">
            Here you can manage all users.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchUserDialog />
          <Link
            href={"/dashboard/users/create"}
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <UserPlus size={16} />
            Create New User
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Server</TableHead>
            <TableHead>Service name</TableHead>
            <TableHead>Total volume</TableHead>
            <TableHead>Expire in</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow
              className={cn("font-medium", {
                "text-red-600": !Boolean(user.services.length),
              })}
              key={user.id}
            >
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.services.at(0)?.server.name}</TableCell>
              <TableCell>{user.services.at(0)?.name}</TableCell>
              <TableCell>
                {byteToGB(user.services.at(0)?.total || 0)} GB
              </TableCell>
              <TableCell>
                {(user.services.at(0)?.expire.getTime() || 0) >
                new Date().getTime()
                  ? formatDistance(Date.now(), user.services.at(0)?.expire || 0)
                  : "Expired"}
              </TableCell>
              <TableCell className="select-none text-gray-50">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {Boolean(user.services.length) && (
                      <DropdownMenuItem>
                        <Link href={`/dashboard/users/${user.id}/view`}>
                          Account status
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Link href={`/dashboard/users/${user.id}/recharge`}>
                        Recharge account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/users/${user.id}/history`}>
                        Service History
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        total={10}
        current={+(searchParams.page || 1)}
        haveNext={users?.length >= 10}
      />
    </div>
  );
}

function Pagination({
  total,
  onChange,
  current,
  haveNext,
}: {
  total: number;
  onChange?: any;
  current: number;
  haveNext: boolean;
}) {
  return (
    <div className="mt-5 flex w-full max-w-md items-center  gap-4 bg-transparent">
      <Link
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), {
          "pointer-events-none cursor-not-allowed": current <= 1,
        })}
        href={{
          href: "?",
          query: {
            page: current - 1,
          },
        }}
      >
        <ChevronLeft />
      </Link>
      <Link
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), {
          "pointer-events-none cursor-not-allowed": !haveNext,
        })}
        href={{
          href: "?",
          query: {
            page: current + 1,
          },
        }}
      >
        <ChevronRight />
      </Link>
    </div>
  );
}
