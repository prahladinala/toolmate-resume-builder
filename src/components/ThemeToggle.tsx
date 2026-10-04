"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative h-10 w-10 rounded-full border border-zinc-200 dark:border-[#27272a] flex items-center justify-center bg-white dark:bg-[#09090b] text-zinc-500 dark:text-[#a1a1aa] shadow-sm"
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-200 dark:border-[#27272a] flex items-center justify-center bg-white dark:bg-[#111113] hover:bg-zinc-50 dark:hover:bg-[#27272a]/50 text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-[#fafafa] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
