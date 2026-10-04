import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] px-3.5 py-2 text-sm text-zinc-900 dark:text-[#fafafa] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#71717a] hover:border-[#3f3f46] focus-visible:border-emerald-500 focus-visible:ring-[2px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
