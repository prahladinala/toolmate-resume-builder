"use client";

import { useState, useEffect } from "react";

const TEXTS = [
  "Design Sandbox",
  "ATS Optimizer",
  "Developer Toolkit",
  "Privacy First",
];

export function HeroAnimatedText() {
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % TEXTS.length);
        setIsVisible(true);
      }, 250);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[#a855f7] inline-flex items-center h-[1.2em]">
      <span
        className={`transition-all duration-300 ease-out inline-block ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {TEXTS[textIndex]}
      </span>
      <span className="w-[4px] h-[0.8em] bg-[#a855f7] ml-1 lg:ml-2 rounded-full inline-block animate-pulse" />
    </span>
  );
}
