"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Project description is required"),
  technologies: z.string().min(1, "Add at least one technology"),
  url: z.string().optional(),
  github: z.string().optional(),
});

export function ProjectsForm() {
  const { data, addProject, removeProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      technologies: "",
      url: "",
      github: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    // Process technologies string into array
    const techs = formData.technologies
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const newProj = {
      ...formData,
      id: crypto.randomUUID(),
      technologies: techs,
    };
    addProject(newProj);
    reset();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        <p className="text-sm text-muted-foreground">
          Highlight your best work and personal projects.
        </p>
      </div>

      {/* Add New Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-5 rounded-2xl border border-[#27272a] bg-[#111113]"
      >
        <h3 className="font-medium text-[#fafafa] mb-2">Add New Project</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="E-commerce Platform"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">
              Technologies * (comma separated)
            </Label>
            <Input
              id="technologies"
              placeholder="React, Node.js, PostgreSQL"
              {...register("technologies")}
            />
            {errors.technologies && (
              <p className="text-xs text-destructive">
                {errors.technologies.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Live URL</Label>
            <Input id="url" placeholder="https://..." {...register("url")} />
            {errors.url && (
              <p className="text-xs text-destructive">
                {errors.url.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              placeholder="https://github.com/..."
              {...register("github")}
            />
            {errors.github && (
              <p className="text-xs text-destructive">
                {errors.github.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you built and the problems it solved..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="rounded-xl bg-[#fafafa] text-[#09090b] hover:bg-[#e4e4e7] font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3 mt-6">
        {data.projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-[#27272a] bg-[#09090b] overflow-hidden group"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#111113] transition-colors"
              onClick={() =>
                setExpandedId(expandedId === proj.id ? null : proj.id)
              }
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-4 h-4 text-[#a1a1aa] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                <div>
                  <h4 className="font-semibold text-[#fafafa]">{proj.name}</h4>
                  <p className="text-xs text-[#a1a1aa] mt-0.5 truncate max-w-[250px] sm:max-w-md">
                    {proj.technologies.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(proj.id);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedId === proj.id ? (
                  <ChevronUp className="w-4 h-4 text-[#a1a1aa]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#a1a1aa]" />
                )}
              </div>
            </div>
            {expandedId === proj.id && (
              <div className="p-4 border-t border-[#27272a] bg-[#111113]">
                <p className="text-sm text-[#a1a1aa] whitespace-pre-wrap">
                  {proj.description}
                </p>
                <div className="flex gap-4 mt-4 text-xs font-medium text-emerald-400">
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Live Site
                    </a>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
