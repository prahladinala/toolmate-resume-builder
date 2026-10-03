import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-[#27272a] bg-[#111113] px-3.5 py-3 text-sm text-[#fafafa] transition-all outline-none placeholder:text-[#71717a] hover:border-[#3f3f46] focus-visible:border-emerald-500 focus-visible:ring-[2px] focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 resize-y",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
