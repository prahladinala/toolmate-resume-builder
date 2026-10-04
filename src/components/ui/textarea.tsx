import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] px-3.5 py-3 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-all outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-[#27272a] hover:border-zinc-300 dark:hover:border-zinc-700 focus-visible:bg-white dark:focus-visible:bg-[#18181b] focus-visible:border-emerald-500 focus-visible:ring-[3px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 resize-y",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
