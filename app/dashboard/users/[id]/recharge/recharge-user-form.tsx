"use client";
import React, { useState } from "react";
import { serverClient } from "@/trpc/serverClient";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Check,
  Database,
  Loader,
  Package,
  Settings2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Services } from "@/consts";
import SelectedService from "@/components/selected-service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rechargeUserSchema } from "@/schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Service } from "@prisma/client";
import { Server } from ".prisma/client";
import { Inbound } from "@/VpsServer";

interface RechargeFormProps {
  servers: NonNullable<Awaited<ReturnType<typeof serverClient.servers.list>>>;
  user: NonNullable<Awaited<ReturnType<typeof serverClient.users.get>>>;
  inbounds?: Inbound[];
}

type RechargeUserFormProps = z.infer<typeof rechargeUserSchema>;

function CurrentService({
  service,
  inbound,
}: {
  service: Service & { server: Server };
  inbound?: Inbound;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">
          {service.isActive ? "Current" : "Previous"} Service
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service</CardTitle>
            <Package className="opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{service.name}</div>
            <p className="text-xs text-muted-foreground">
              {service.isActive ? "Current" : "Previous"} service name
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server</CardTitle>
            <Database className="opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{service.server.name}</div>
            <p className="text-xs text-muted-foreground">
              {service.isActive ? "Current" : "Previous"} server
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Config</CardTitle>
            <Settings2 className="opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inbound?.remark || "Config Deleted!"}
            </div>
            <p className="text-xs text-muted-foreground">
              {inbound?.protocol && (
                <Badge className="scale-90">{inbound.protocol}</Badge>
              )}
              {inbound?.protocol && (
                <Badge className="scale-90">
                  {inbound.streamSettings.network}
                </Badge>
              )}
              {inbound?.streamSettings.security != "none" && (
                <Badge className="scale-90">
                  {inbound?.streamSettings.security}
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const RechargeUserForm = ({ user, servers, inbounds }: RechargeFormProps) => {
  const router = useRouter();
  const rechargeUser = trpc.users.recharge.useMutation({
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Error!",
          description: error.message.toString(),
        });
      }
      if (data) {
        toast({
          title: "User Account recharged!!",
          description:
            "User account recharged successfully, you will redirect to user information soon!",
        });
        router.push(`/dashboard/users/${data.id}/view`);
      }
    },
  });
  const [selectedService, setSelectedService] = useState<any>();
  const form = useForm<RechargeUserFormProps>({
    mode: "onChange",
    resolver: zodResolver(rechargeUserSchema),
    defaultValues: {
      id: user.id,
      serverId: user.services[0].server.id,
      inbound: user.services[0].inbound,
      service: Services.find(({ name }) => name === user.services[0].name)!.id,
    },
  });
  const getInbounds = trpc.providers.inbounds.useQuery(
    form.getValues("serverId"),
    {
      enabled: Boolean(form.getValues("serverId")),
    },
  );

  if (getInbounds.error) {
    toast({
      title: "Fetch error",
      description: getInbounds.error.message,
    });
  }

  async function onSubmit(data: RechargeUserFormProps) {
    rechargeUser.mutate(data);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Recharge user account.
          </h2>
          <p className="text-muted-foreground">
            Here you can recharge a user account.
          </p>
        </div>
      </div>

      <CurrentService
        service={user.services?.at(0)!}
        inbound={inbounds?.find(({ id }) => id === user.services[0].inbound)}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Username"}
                    value={user.username}
                    disabled
                  />
                </FormControl>
                <FormDescription>Current user username.</FormDescription>
                <FormMessage />
              </FormItem>
            </div>
            <div className="col-span-6">
              <FormField
                name={"serverId"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server</FormLabel>
                    <FormControl>
                      <Select
                        disabled={getInbounds.isFetching}
                        onValueChange={(value) => {
                          field.onChange(value);
                          getInbounds.refetch();
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="overflow-hidden truncate">
                          <SelectValue placeholder="Select a server" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            {servers.map((server) => (
                              <SelectItem value={server.id} key={server.id}>
                                {server.name} - {server.location.countryName} -
                                ({server.ip})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormDescription>All active servers</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                name={"inbound"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Config</FormLabel>
                    <FormControl>
                      <Select
                        disabled={getInbounds.isFetching}
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger className="overflow-hidden truncate">
                          <SelectValue
                            placeholder={
                              <div className="flex items-center gap-2">
                                {getInbounds.isFetching && (
                                  <Loader
                                    className={"animate-spin"}
                                    size={16}
                                  />
                                )}
                                Select a config
                              </div>
                            }
                          />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectGroup>
                            {getInbounds?.data?.map((inbound) => (
                              <SelectItem
                                value={inbound.id.toString()}
                                key={inbound.id}
                              >
                                {inbound.remark} -
                                <Badge className="scale-90">
                                  {inbound.protocol}
                                  {" - "}
                                  {inbound.streamSettings.network}
                                  {inbound.streamSettings.security ===
                                    "reality" && (
                                    <Check
                                      size={12}
                                      className="ml-1 stroke-green-800"
                                    />
                                  )}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Available server configs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12">
              <FormField
                name={"service"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedService(
                          Services.find(({ id }) => id === +value),
                        );
                      }}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select a service"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {Services.map((item) => (
                            <SelectItem
                              value={item.id?.toString()}
                              key={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>All available services.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12">
              <SelectedService service={selectedService} />
            </div>
            <div className="col-span-12">
              <Button
                className="gap-2"
                disabled={rechargeUser.isLoading || !!rechargeUser.data}
              >
                {(rechargeUser.isLoading || rechargeUser.data) && (
                  <Loader size={16} className="animate-spin" />
                )}
                {rechargeUser.isLoading || rechargeUser.data
                  ? "Recharging User"
                  : "Recharge User"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RechargeUserForm;
