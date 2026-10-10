/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { AIHelper } from "../AIHelper";
import { PowerVerbs } from "../PowerVerbs";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Local schema for form editing (technologies as string)
const projectFormSchema = z.object({
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Project name is required"),
      description: z.string().min(10, "Project description is required"),
      technologies: z.string().min(1, "Add at least one technology"),
      url: z.string().optional(),
      github: z.string().optional(),
    }),
  ),
});

function SortableProjectItem({
  id,
  index,
  register,
  errors,
  onRemove,
  watch,
  setValue,
}: {
  id: string;
  index: number;
  register: any;
  errors: any;
  onRemove: (index: number) => void;
  watch: any;
  setValue: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
      className="p-4 border border-zinc-200 dark:border-[#27272a] rounded-xl space-y-4 bg-zinc-50 dark:bg-[#111113] relative group shadow-sm"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-move text-zinc-500 dark:text-[#a1a1aa] hover:text-zinc-900 dark:text-[#fafafa]"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 dark:text-[#a1a1aa] hover:text-red-400"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <Label>Project Name *</Label>
          <Input
            placeholder="E-commerce Platform"
            {...register(`projects.${index}.name`)}
          />
          {errors.projects?.[index]?.name && (
            <p className="text-xs text-destructive">
              {errors.projects[index].name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Technologies * (comma separated)</Label>
          <Input
            placeholder="React, Node.js, PostgreSQL"
            {...register(`projects.${index}.technologies`)}
          />
          {errors.projects?.[index]?.technologies && (
            <p className="text-xs text-destructive">
              {errors.projects[index].technologies.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Live URL</Label>
          <Input
            placeholder="https://..."
            {...register(`projects.${index}.url`)}
          />
        </div>
        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input
            placeholder="https://github.com/..."
            {...register(`projects.${index}.github`)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <Label>Description *</Label>
            <div className="flex items-center gap-2">
              <AIHelper
                currentText={
                  (watch && watch(`projects.${index}.description`)) || ""
                }
                onUpdate={(improvedText) => {
                  if (setValue) {
                    setValue(`projects.${index}.description`, improvedText, {
                      shouldValidate: true,
                    });
                  }
                }}
                targetId={`project-${index}-ai-options`}
                sectionType="project"
              />
              <PowerVerbs
                onSelect={(verb) => {
                  const currentDesc =
                    (watch && watch(`projects.${index}.description`)) || "";
                  if (setValue) {
                    setValue(
                      `projects.${index}.description`,
                      currentDesc +
                        (currentDesc && !currentDesc.endsWith(" ") ? " " : "") +
                        verb,
                      { shouldValidate: true },
                    );
                  }
                }}
              />
            </div>
          </div>
          <Textarea
            placeholder="Describe what you built and the problems it solved..."
            className="min-h-[100px]"
            {...register(`projects.${index}.description`)}
          />
          <div id={`project-${index}-ai-options`} />
          {errors.projects?.[index]?.description && (
            <p className="text-xs text-destructive">
              {errors.projects[index].description.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsForm() {
  const { data, reorderProjects } = useResumeStore();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projects: data.projects.map((proj) => ({
        ...proj,
        technologies: proj.technologies.join(", "),
      })),
    },
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "projects",
  });

  const handleRemove = (index: number) => {
    const removedItem = fields[index];
    remove(index);
    toast("Project removed", {
      description: removedItem?.name
        ? removedItem.name
        : "Item removed from projects",
      action: {
        label: "Undo",
        onClick: () => {
          insert(index, removedItem);
        },
      },
    });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (value.projects) {
          const mappedProjects = value.projects.map(
            (p: {
              id?: string;
              name?: string;
              description?: string;
              technologies?: string;
              url?: string;
              github?: string;
            }) => ({
              ...p,
              technologies: (p.technologies || "")
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean),
            }),
          );
          useResumeStore.setState((state) => ({
            data: {
              ...state.data,
              projects: mappedProjects,
            },
          }));
        }
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [watch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over?.id);
      move(oldIndex, newIndex);
      reorderProjects(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Highlight your best work and personal projects.
          </p>
        </div>
        <Button
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              name: "",
              description: "",
              technologies: "",
              url: "",
              github: "",
            })
          }
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {fields.map((field, index) => (
              <SortableProjectItem
                key={field.id}
                id={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={handleRemove}
                watch={watch}
                setValue={setValue}
              />
            ))}
            {fields.length === 0 && (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-[#27272a] rounded-xl text-zinc-500 dark:text-[#a1a1aa]">
                No projects added yet. Click the Add button above.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
