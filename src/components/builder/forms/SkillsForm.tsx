"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export function SkillsForm() {
  const { data, addSkill, removeSkill } = useResumeStore();
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("Technical Skills");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    // Split by comma to allow multiple skills at once
    const skills = newSkill.split(",").map((s) => s.trim()).filter(Boolean);

    skills.forEach((skillName) => {
      addSkill({
        id: crypto.randomUUID(),
        name: skillName,
        category: newCategory.trim() || "Technical Skills",
      });
    });

    setNewSkill("");
  };

  // Group skills by category
  const groupedSkills = data.skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof data.skills>,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <p className="text-sm text-[#a1a1aa] mt-1">
          List your skills. You can paste multiple skills separated by commas.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-4 items-end bg-[#111113] p-5 rounded-2xl border border-[#27272a] shadow-sm"
      >
        <div className="space-y-2 w-full md:w-1/3">
          <Label htmlFor="category" className="text-[#a1a1aa]">Category</Label>
          <Input
            id="category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Languages, Frameworks"
            className="bg-[#09090b] border-[#27272a] focus-visible:ring-[#a855f7]"
          />
        </div>
        <div className="space-y-2 w-full md:flex-1">
          <Label htmlFor="skill" className="text-[#a1a1aa]">Skill(s) *</Label>
          <div className="flex gap-3">
            <Input
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. JavaScript, React..."
              className="bg-[#09090b] border-[#27272a] focus-visible:ring-[#a855f7]"
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

      <div className="space-y-6 mt-8">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27272a]/50 border border-[#27272a] text-sm text-[#fafafa] group hover:border-[#a855f7]/50 transition-colors"
                >
                  <span>{skill.name}</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-[#a1a1aa] hover:text-red-400 focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {data.skills.length === 0 && (
          <div className="text-center p-12 border border-dashed border-[#27272a] rounded-2xl text-[#a1a1aa] text-sm bg-[#111113]/30">
            No skills added yet. Add some above!
          </div>
        )}
      </div>
    </div>
  );
}
