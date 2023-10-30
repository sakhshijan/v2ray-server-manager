"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import React from "react";

export function QrCodeComponent({ config }: { config: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode size={16} /> Connection Qr Code
        </Button>
      </PopoverTrigger>
      <PopoverContent align={"start"} className="w-72 bg-neutral-950">
        <QRCodeCanvas
          bgColor={"#000"}
          fgColor={"#fefefe"}
          size={256}
          value={config || "NO Code"}
          className={"aspect-square h-64"}
        />
      </PopoverContent>
    </Popover>
  );
}
