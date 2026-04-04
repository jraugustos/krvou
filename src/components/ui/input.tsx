import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border-2 border-outline-variant bg-surface-lowest px-3 py-2 font-sans text-base text-foreground transition-all duration-200 outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:shadow-glow-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-glow-destructive md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
