import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gbToByte(gb: number) {
  return gb * 1024 ** 3;
}

export function byteToGB(byte: number | bigint) {
  return Number(byte) / 1024 ** 3;
}
