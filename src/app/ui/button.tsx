import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "lg";
}

export function Button({
  children,
  className,
  size = "sm",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium",
        size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm",
        className ?? ""
      )}
      {...props}
    >
      {children}
    </button>
  );
}
