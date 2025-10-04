import * as React from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
  data-slot="textarea"
  className={cn(
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-40 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[200px] w-full border rounded-md px-3 py-2 text-base resize-y",
    className
  )}
  {...props}
/>

  );
}

export { Textarea };
