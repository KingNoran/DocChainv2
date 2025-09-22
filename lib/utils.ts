import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name?: string) => {
  if (!name) return ""; // or "?" or fallback avatar
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
}
