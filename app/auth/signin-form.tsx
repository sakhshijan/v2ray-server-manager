"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import { AuthProviders } from "@/app/api/auth/[...nextauth]/route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type SigninFormValue = z.infer<typeof signInSchema>;

export function SigninForm() {
  const form = useForm<SigninFormValue>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: SigninFormValue) {
    setIsLoading(true);
    const result = await signIn(AuthProviders.Credentials, {
      redirect: false,
      ...data,
    });

    if (!result) {
      setIsLoading(false);
      toast({
        title: "Network error!",
      });
      return;
    }
    if (result?.status !== 200) {
      setIsLoading(false);

      toast({
        title: "Wrong credentials!",
      });
      form.resetField("password");
      return;
    }

    toast({
      title: "Welcome!",
      description: "Redirecting to Dashboard ...",
    });
    router.push("/dashboard");
  }

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 space-y-4">
            <div className="grid gap-1 space-y-1">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Username ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        placeholder="Password ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Username
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
