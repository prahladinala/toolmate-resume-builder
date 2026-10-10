/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Sparkles, Layers, List, Loader2 } from "lucide-react";
import { AISkillSuggester } from "../AISkillSuggester";
import { categorizeSkillsList } from "@/lib/skillCategorizer";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableSkillChip({
  skill,
  onRemove,
}: {
  skill: { id: string; name: string; category?: string };
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-200 dark:bg-[#27272a]/50 border border-zinc-200 dark:border-[#27272a] text-sm text-zinc-900 dark:text-[#fafafa] group hover:border-[#a855f7]/50 transition-colors cursor-grab active:cursor-grabbing"
    >
      <span>{skill.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(skill.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-zinc-500 dark:text-[#a1a1aa] hover:text-red-400 focus:outline-none"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function SkillsForm() {
  const { data, addSkill, removeSkill, reorderSkills } = useResumeStore();
  const [newSkill, setNewSkill] = useState("");
  const [viewMode, setViewMode] = useState<"flat" | "categorized">("flat");
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const skills = newSkill
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    skills.forEach((skillName) => {
      addSkill({
        id: crypto.randomUUID(),
        name: skillName,
        category: "Core Skills",
      });
    });

    setNewSkill("");
  };

  const handleAutoCategorize = async () => {
    if (data.skills.length === 0) {
      toast.error("No skills added yet to categorize.");
      return;
    }

    try {
      setIsCategorizing(true);
      const categorized = await categorizeSkillsList(data.skills);

      useResumeStore.setState((state) => ({
        data: {
          ...state.data,
          skills: categorized,
        },
      }));

      setViewMode("categorized");
      toast.success("Skills categorized into ATS groups!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to categorize skills");
    } finally {
      setIsCategorizing(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = data.skills.findIndex((item) => item.id === active.id);
      const newIndex = data.skills.findIndex((item) => item.id === over?.id);
      reorderSkills(oldIndex, newIndex);
    }
  };

  // Group skills by category
  const categorizedGroups = data.skills.reduce(
    (acc, skill) => {
      const cat = skill.category || "Core Skills";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, typeof data.skills>,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          <p className="text-sm text-zinc-500 dark:text-[#a1a1aa] mt-1">
            List your technical competencies and core strengths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAutoCategorize}
            disabled={isCategorizing || data.skills.length === 0}
            className="rounded-xl border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-semibold gap-1.5"
          >
            {isCategorizing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Auto-Group (AI)</span>
          </Button>

          <div className="flex border border-zinc-200 dark:border-[#27272a] rounded-xl p-0.5 bg-zinc-100 dark:bg-[#18181b]">
            <button
              onClick={() => setViewMode("flat")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "flat"
                  ? "bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
              title="Flat List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("categorized")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "categorized"
                  ? "bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
              title="Grouped by Category View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AISkillSuggester />

      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-4 items-end bg-zinc-50 dark:bg-[#111113] p-5 rounded-2xl border border-zinc-200 dark:border-[#27272a] shadow-sm"
      >
        <div className="space-y-2 w-full">
          <Label htmlFor="skill" className="text-zinc-500 dark:text-[#a1a1aa]">
            Skill(s) *
          </Label>
          <div className="flex gap-3">
            <Input
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. TypeScript, React, Docker..."
              className="bg-white dark:bg-[#09090b] border-zinc-200 dark:border-[#27272a] focus-visible:ring-[#a855f7]"
              required
            />
            <Button
              type="submit"
              className="px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
            >
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Add</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Skills Display */}
      {viewMode === "flat" ? (
        <div className="mt-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.skills.map((s) => s.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <SortableSkillChip
                    key={skill.id}
                    skill={skill}
                    onRemove={removeSkill}
                  />
                ))}
                {data.skills.length === 0 && (
                  <div className="w-full text-center p-12 border border-dashed border-zinc-200 dark:border-[#27272a] rounded-2xl text-zinc-500 dark:text-[#a1a1aa] text-sm bg-zinc-50 dark:bg-[#111113]/30">
                    No skills added yet. Add some above!
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {Object.entries(categorizedGroups).map(
            ([categoryName, groupSkills]) => (
              <div
                key={categoryName}
                className="p-4 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b]/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    {categoryName}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {groupSkills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-[#3f3f46] text-xs text-zinc-800 dark:text-zinc-200 shadow-2xs"
                    >
                      <span>{skill.name}</span>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="text-zinc-400 hover:text-red-400 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}

          {data.skills.length === 0 && (
            <div className="w-full text-center p-12 border border-dashed border-zinc-200 dark:border-[#27272a] rounded-2xl text-zinc-500 dark:text-[#a1a1aa] text-sm bg-zinc-50 dark:bg-[#111113]/30">
              No skills added yet. Add some above!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
