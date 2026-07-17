/* eslint-disable react-refresh/only-export-components */

import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",

        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",

        outline:
          "text-foreground",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };