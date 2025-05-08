import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Status } from "./entities";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusToColorsMap = {
  [Status.ACTIVE]: "bg-green-500",
  [Status.DRAFT]: "bg-amber-500",
  [Status.DELETED]: "bg-red-500",
};
