"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";

export function SkillsForm() {
  const { data, addSkill, removeSkill } = useResumeStore();
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    addSkill({
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      category: newCategory.trim() || "Technical Skills",
    });

    setNewSkill("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <p className="text-sm text-muted-foreground">
          List your technical and professional skills.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex gap-4 items-end bg-[#111113] p-4 rounded-xl border border-[#27272a]"
      >
        <div className="space-y-2 flex-1">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Languages"
          />
        </div>
        <div className="space-y-2 flex-[2]">
          <Label htmlFor="skill">Skill *</Label>
          <Input
            id="skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. JavaScript, React..."
            required
          />
        </div>
        <Button
          type="submit"
          className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </form>

      <div className="space-y-2 mt-6">
        {data.skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-3 rounded-xl border border-[#27272a] bg-[#111113]/50 group hover:border-[#3f3f46] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-[#a1a1aa] cursor-grab active:cursor-grabbing opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#fafafa]">
                  {skill.name}
                </p>
                <p className="text-xs text-[#a1a1aa]">{skill.category}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSkill(skill.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {data.skills.length === 0 && (
          <div className="text-center p-8 border border-dashed border-[#27272a] rounded-xl text-[#a1a1aa] text-sm">
            No skills added yet. Add some above!
          </div>
        )}
      </div>
    </div>
  );
}
