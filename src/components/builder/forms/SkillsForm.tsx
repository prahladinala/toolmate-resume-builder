"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
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

function SortableSkillChip({ skill, onRemove }: { skill: { id: string; name: string; category: string }; onRemove: (id: string) => void }) {
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
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking remove
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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    // Split by comma to allow multiple skills at once
    const skills = newSkill.split(",").map((s) => s.trim()).filter(Boolean);

    skills.forEach((skillName) => {
      addSkill({
        id: crypto.randomUUID(),
        name: skillName,
        category: "Technical Skills", // Default category ignored in UI
      });
    });

    setNewSkill("");
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <p className="text-sm text-zinc-500 dark:text-[#a1a1aa] mt-1">
          List your skills. You can paste multiple skills separated by commas, and drag them to reorder.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-4 items-end bg-zinc-50 dark:bg-[#111113] p-5 rounded-2xl border border-zinc-200 dark:border-[#27272a] shadow-sm"
      >
        <div className="space-y-2 w-full">
          <Label htmlFor="skill" className="text-zinc-500 dark:text-[#a1a1aa]">Skill(s) *</Label>
          <div className="flex gap-3">
            <Input
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. JavaScript, React..."
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
                <SortableSkillChip key={skill.id} skill={skill} onRemove={removeSkill} />
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
    </div>
  );
}
