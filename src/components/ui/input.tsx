import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full min-w-0 font-sans text-base text-foreground transition-all duration-200 outline-none placeholder:text-on-surface-variant/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "h-10 border-2 border-outline-variant bg-surface-lowest px-3 py-2 focus:border-primary focus:shadow-glow-primary aria-invalid:border-destructive aria-invalid:shadow-glow-destructive",
        pill:
          "h-12 rounded-pill border-none bg-surface-lowest-light pl-6 pr-6 text-on-surface-light shadow-drop-soft placeholder:text-on-surface-variant-light/60 focus:ring-2 focus:ring-primary aria-invalid:ring-2 aria-invalid:ring-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

function Input({ className, type, variant, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
