"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

export function CopyConfigsButton({ configs }: { configs: string }) {
  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={async () => {
        await navigator.clipboard.writeText(configs);
        toast({
          title: "Copied!",
          description: "Config copied to your clipboard.",
        });
      }}
    >
      <Copy size={16} />
      Copy Config
    </Button>
  );
}
