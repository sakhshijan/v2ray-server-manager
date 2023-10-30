"use client";
import React from "react";
import { serverClient } from "@/trpc/serverClient";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editServerSchema } from "@/schemas";
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
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

interface EditServerFormProps {
  server: NonNullable<Awaited<ReturnType<typeof serverClient.servers.get>>>;
}

type CreateServerFormProps = z.infer<typeof editServerSchema>;

const EditServerForm = ({ server }: EditServerFormProps) => {
  const router = useRouter();
  const updateServer = trpc.servers.edit.useMutation({
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
          title: "Server updated!",
          description:
            "Server updated successfully, you will redirect to server information soon!",
        });
        router.push(`/dashboard/servers/${data.id}/view`);
      }
    },
  });
  const form = useForm<CreateServerFormProps>({
    mode: "onChange",
    resolver: zodResolver(editServerSchema),
    defaultValues: server,
  });

  async function onSubmit(data: CreateServerFormProps) {
    updateServer.mutate(data);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex  items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modify Servers</h2>
          <p className="text-muted-foreground">
            You are about to modify {server.name}
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
                      <Input
                        placeholder={"Domain ..."}
                        {...field}
                        value={field.value as string}
                      />
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
              <FormItem>
                <FormLabel>Server ip</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"IP Address"}
                    disabled
                    value={server.ip}
                  />
                </FormControl>
                <FormDescription>
                  You cannot change a server ip address!
                </FormDescription>
                <FormMessage />
              </FormItem>
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
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is an Active server?</FormLabel>
                      <FormDescription>
                        is this server active and providing a VPN or not.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12">
              <Button
                className="gap-2"
                disabled={updateServer.isLoading || !!updateServer.data}
              >
                {(updateServer.isLoading || updateServer.data) && (
                  <Loader size={16} className="animate-spin" />
                )}
                {updateServer.isLoading || updateServer.data
                  ? "Updating Server"
                  : "Update Server"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditServerForm;
