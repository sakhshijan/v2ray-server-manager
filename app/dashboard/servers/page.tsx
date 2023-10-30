import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { serverClient } from "@/trpc/serverClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Servers list",
};

export default async function Servers() {
  const servers = await serverClient.servers.list({
    includeServersCount: true,
  });
  return (
    <div className="space-y-4">
      <div className="flex  items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manager Servers</h2>
          <p className="text-muted-foreground">
            Here you can manage all servers.
          </p>
        </div>
        <Link
          href={"/dashboard/servers/create"}
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <PlusSquare size={16} />
          Create New Server
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Server name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead className="text-right">Active services</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium">
          {servers.map((server) => (
            <TableRow key={server.id}>
              <TableCell>{server.name}</TableCell>
              <TableCell>
                {server.location.countryName} ({server.location.region})
              </TableCell>
              <TableCell>{server.ip}</TableCell>
              <TableCell>{server.domain}</TableCell>
              <TableCell className="text-right">
                {server._count.services}
              </TableCell>
              <TableCell className="select-none">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Server status</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/servers/${server.id}/services`}>
                        Service history
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/servers/${server.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
