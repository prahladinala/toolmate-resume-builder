"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEXTS = [
  "Design Sandbox",
  "ATS Optimizer",
  "Developer Toolkit",
  "Privacy First",
];

export function HeroAnimatedText() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[#a855f7] inline-flex items-center h-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={textIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {TEXTS[textIndex]}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="w-[4px] h-[0.8em] bg-[#a855f7] ml-1 lg:ml-2 rounded-full inline-block"
      />
    </span>
  );
}
