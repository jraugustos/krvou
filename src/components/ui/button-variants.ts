import { cva } from "class-variance-authority";

/**
 * Button style variants — extracted so they can be used in both
 * Server Components (e.g. Link styled as button) and Client Components.
 */
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-0 font-heading text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-100 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-arcade-primary active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:brightness-110",
        secondary:
          "bg-secondary-container text-secondary-foreground shadow-arcade-secondary active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:brightness-110",
        tertiary:
          "bg-transparent text-primary underline decoration-dotted decoration-2 underline-offset-4 hover:decoration-solid active:opacity-80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-arcade-destructive active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:brightness-110",
        outline:
          "border-2 border-outline-variant bg-transparent text-foreground hover:bg-surface-high active:bg-surface-highest",
        ghost:
          "bg-transparent text-foreground hover:bg-surface-high active:bg-surface-highest",
      },
      size: {
        default: "h-10 gap-2 px-5 py-2",
        sm: "h-8 gap-1.5 px-3 py-1.5 text-xs",
        lg: "h-12 gap-2.5 px-7 py-3 text-base",
        xl: "h-14 gap-3 px-8 py-4 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
