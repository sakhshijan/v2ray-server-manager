"use client";
import React from "react";
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
import { createServerSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Metadata } from "next";

type CreateServerFormProps = z.infer<typeof createServerSchema>;

const CreateServer = () => {
  const router = useRouter();
  const createServer = trpc.servers.create.useMutation({
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Error!",
          description: error.message.toString(),
          variant: "error",
        });
      }
      if (data) {
        toast({
          title: "Server created!",
          description:
            "Server created successfully, you will redirect to server information soon!",
        });
        router.push(`/dashboard/servers/${data.id}/view`);
      }
    },
  });
  const form = useForm<CreateServerFormProps>({
    mode: "onChange",
    resolver: zodResolver(createServerSchema),
  });

  async function onSubmit(data: CreateServerFormProps) {
    createServer.mutate(data);
    console.log(data);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex  items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create A New Servers
          </h2>
          <p className="text-muted-foreground">
            Here you can manage all servers.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                name={"name"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input placeholder={"Server name"} {...field} />
                    </FormControl>
                    <FormDescription>
                      This is a remark for server.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                name={"domain"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain name</FormLabel>
                    <FormControl>
                      <Input placeholder={"Domain ..."} {...field} />
                    </FormControl>
                    <FormDescription>
                      Server domain is a url using in configurations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                name={"ip"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server ip</FormLabel>
                    <FormControl>
                      <Input placeholder={"IP Address"} {...field} />
                    </FormControl>
                    <FormDescription>
                      Server ip address must be unique in servers!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                name={"port"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder={"Port"} {...field} />
                    </FormControl>
                    <FormDescription>Server X-UI Port</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                name={"path"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panel path</FormLabel>
                    <FormControl>
                      <Input placeholder={"Panel path"} {...field} />
                    </FormControl>
                    <FormDescription>Panel path address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                name={"username"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder={"Username"} {...field} />
                    </FormControl>
                    <FormDescription>X-UI Username.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                name={"password"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={"Password ..."}
                        autoComplete={"new-password"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>X-UI Password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12">
              <Button
                className="gap-2"
                disabled={createServer.isLoading || !!createServer.data}
              >
                {(createServer.isLoading || createServer.data) && (
                  <Loader size={16} className="animate-spin" />
                )}
                {createServer.isLoading || createServer.data
                  ? "Creating Server"
                  : "Create Server"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateServer;
