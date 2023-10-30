"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectedService from "@/components/selected-service";
import { Services } from "@/consts";
import { serverClient } from "@/trpc/serverClient";
import { Badge } from "@/components/ui/badge";

type CreateUserFormProps = z.infer<typeof createUserSchema>;

type CreateUserPageProps = {
  servers: Awaited<ReturnType<typeof serverClient.servers.list>>;
};
const CreateUser = ({ servers }: CreateUserPageProps) => {
  const router = useRouter();
  const createUser = trpc.users.create.useMutation({
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Error!",
          description: error.message.toString(),
        });
      }
      if (data) {
        toast({
          title: "User created!",
          description:
            "User created successfully, you will redirect to server information soon!",
        });
        router.push(`/dashboard/users/${data.id}/view`);
      }
    },
  });
  const [selectedService, setSelectedService] = useState<any>();
  const form = useForm<CreateUserFormProps>({
    mode: "onChange",
    resolver: zodResolver(createUserSchema),
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

  async function onSubmit(data: CreateUserFormProps) {
    createUser.mutate(data);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex  items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create A New User
          </h2>
          <p className="text-muted-foreground">
            Here you can create a new user.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <FormField
                name={"username"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder={"Username"} {...field} />
                    </FormControl>
                    <FormDescription>Create a new username.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

                    <FormDescription>X-UI Username.</FormDescription>
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
                      <SelectContent className="max-h-[10rem] overflow-y-auto">
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
                disabled={createUser.isLoading || !!createUser.data}
              >
                {(createUser.isLoading || createUser.data) && (
                  <Loader size={16} className="animate-spin" />
                )}
                {createUser.isLoading || createUser.data
                  ? "Creating User"
                  : "Create User"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateUser;
