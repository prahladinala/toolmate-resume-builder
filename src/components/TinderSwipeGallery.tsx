"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { TemplateEngine } from "@/components/builder/TemplateEngine";
import type { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";

interface TinderSwipeGalleryProps {
  templates: {
    id: string;
    name: string;
    category: string;
    ats: number;
    color: string;
  }[];
  onSelect: (templateId: string) => void;
  dummyData: ResumeData;
}

export function TinderSwipeGallery({
  templates,
  onSelect,
  dummyData,
}: TinderSwipeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If we run out of templates, we loop back to 0
  const activeTemplate = templates[currentIndex % templates.length];
  // Next template in the stack to show behind the active one
  const nextTemplate = templates[(currentIndex + 1) % templates.length];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSwipe = (direction: "left" | "right") => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-[75vh] flex items-center justify-center overflow-hidden touch-none">
      <AnimatePresence mode="popLayout">
        {/* Next Card (Background) */}
        <motion.div
          key={nextTemplate.id + "-next"}
          className="absolute inset-0 w-full h-full rounded-[24px] border border-[#27272a] bg-[#111113] overflow-hidden flex flex-col pointer-events-none"
          initial={{ scale: 0.95, y: 10, opacity: 0.5 }}
          animate={{ scale: 0.95, y: 10, opacity: 0.5 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex-1 w-full bg-white flex items-center justify-center relative border-b border-[#27272a] @container">
            <div className="absolute inset-0 overflow-hidden bg-white select-none flex items-center justify-center">
              <div
                className="w-[794px] h-[1123px] bg-white origin-center"
                style={{
                  transform: "scale(calc(min(100cqw / 794, 100cqh / 1123)))",
                }}
              >
                <TemplateEngine data={dummyData} templateId={nextTemplate.id} />
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center bg-[#111113]">
            <div>
              <h2 className="font-semibold text-sm text-[#fafafa]">
                {nextTemplate.name}
              </h2>
              <p className="text-[10px] text-[#a1a1aa] capitalize mt-0.5">
                {nextTemplate.category}
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
              ATS: {nextTemplate.ats}%
            </span>
          </div>
        </motion.div>

        {/* Current Card (Foreground Interactive) */}
        <SwipeCard
          key={activeTemplate.id + "-" + currentIndex}
          template={activeTemplate}
          dummyData={dummyData}
          onSwipe={handleSwipe}
          onClick={() => onSelect(activeTemplate.id)}
        />
      </AnimatePresence>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs tracking-wide">
          Swipe left/right to skip • Tap to select
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SwipeCard({ template, dummyData, onSwipe, onClick }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Cross overlay opacity
  const nopeOpacity = useTransform(x, [-100, -50, 0], [1, 0, 0]);
  const nopeOpacityRight = useTransform(x, [0, 50, 100], [0, 0, 1]); // the user said "match no match both should be reject" so we can just show SKIP on both sides

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full rounded-[24px] border border-[#27272a] bg-[#111113] overflow-hidden flex flex-col shadow-2xl cursor-grab active:cursor-grabbing origin-bottom"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (Math.abs(x.get()) < 5) {
          onClick();
        }
      }}
      whileDrag={{ scale: 1.02 }}
      initial={{ scale: 1, y: 0, opacity: 1 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex-1 w-full bg-white flex items-center justify-center relative border-b border-[#27272a] @container pointer-events-none">
        {/* Swipe Overlays */}
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 z-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-1 rounded-xl rotate-12 bg-white/20 backdrop-blur-sm"
        >
          SKIP
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacityRight }}
          className="absolute top-8 left-8 z-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-1 rounded-xl -rotate-12 bg-white/20 backdrop-blur-sm"
        >
          SKIP
        </motion.div>

        <div className="absolute inset-0 overflow-hidden bg-white select-none flex items-center justify-center">
          <div
            className="w-[794px] h-[1123px] bg-white origin-center"
            style={{
              transform: "scale(calc(min(100cqw / 794, 100cqh / 1123)))",
            }}
          >
            <TemplateEngine data={dummyData} templateId={template.id} />
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center bg-[#111113] transition-colors pointer-events-none">
        <div className="pointer-events-none">
          <h2 className="font-semibold text-sm text-[#fafafa]">
            {template.name}
          </h2>
          <p className="text-[10px] text-[#a1a1aa] capitalize mt-0.5">
            {template.category}
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 rounded-full bg-emerald-500 text-white font-semibold pointer-events-none"
          variant="default"
        >
          Tap to Select
        </Button>
      </div>
    </motion.div>
  );
}
