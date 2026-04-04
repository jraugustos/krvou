"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--surface-container)",
          "--normal-text": "var(--on-surface)",
          "--normal-border": "var(--outline-variant)",
          "--border-radius": "0px",
          "--success-bg": "var(--surface-container)",
          "--success-text": "var(--on-surface)",
          "--success-border": "var(--primary)",
          "--error-bg": "var(--surface-container)",
          "--error-text": "var(--on-surface)",
          "--error-border": "var(--destructive)",
          "--info-bg": "var(--surface-container)",
          "--info-text": "var(--on-surface)",
          "--info-border": "var(--tertiary)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!border-l-4 !bg-surface-container !text-on-surface !rounded-none !shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]",
          success: "!border-l-primary",
          error: "!border-l-destructive",
          info: "!border-l-tertiary",
          warning: "!border-l-secondary-container",
          description: "!text-on-surface-variant",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
