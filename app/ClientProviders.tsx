"use client";
import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient } from "@tanstack/query-core";
import { trpc } from "@/trpc/client";
import { httpBatchLink } from "@trpc/client";
import { getBaseUrl } from "@/lib/getBaseUrl";
import superjson from "superjson";
import { QueryClientProvider } from "@tanstack/react-query";

const ClientProviders = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnReconnect: false,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
      },
    }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: getBaseUrl() + "/api/trpc" })],
      transformer: superjson,
    }),
  );

  return (
    <SessionProvider session={session}>
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
};

export default ClientProviders;
