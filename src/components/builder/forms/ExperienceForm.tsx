/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { experienceSchema } from "@/lib/validations";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, Trash2, BarChart2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PowerVerbs } from "../PowerVerbs";
import { AIHelper } from "../AIHelper";
import { AISuggestions } from "../AISuggestions";
import { BulletQuantifierModal } from "../BulletQuantifierModal";
import { AchievementAssistantModal } from "../AchievementAssistantModal";
import { GuidedExperienceModal } from "../GuidedExperienceModal";
import { detectWeakActionVerbs, replaceWeakVerb } from "@/lib/actionVerbs";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formSchema = z.object({
  experiences: z.array(experienceSchema),
});

function SortableExperienceItem({
  id,
  index,
  register,
  errors,
  onRemove,
  watch,
  setValue,
  fields,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [showQuantifier, setShowQuantifier] = useState(false);
  const [showAchievementAssistant, setShowAchievementAssistant] =
    useState(false);

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
          <Label>Company *</Label>
          <Input
            placeholder="Acme Inc."
            {...register(`experiences.${index}.company`)}
          />
          {errors.experiences?.[index]?.company && (
            <p className="text-xs text-destructive">
              {errors.experiences[index].company.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Role *</Label>
          <Input
            placeholder="Software Engineer"
            {...register(`experiences.${index}.role`)}
          />
          {errors.experiences?.[index]?.role && (
            <p className="text-xs text-destructive">
              {errors.experiences[index].role.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            placeholder="Jan 2020"
            {...register(`experiences.${index}.startDate`)}
          />
          {errors.experiences?.[index]?.startDate && (
            <p className="text-xs text-destructive">
              {errors.experiences[index].startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            placeholder="Present"
            {...register(`experiences.${index}.endDate`)}
            disabled={watch(`experiences.${index}.current`)}
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id={`current-${index}`}
            checked={watch(`experiences.${index}.current`)}
            onCheckedChange={(checked) => {
              if (checked) {
                // Uncheck all other experiences
                fields.forEach((_: unknown, i: number) => {
                  if (i !== index) {
                    setValue(`experiences.${i}.current`, false, {
                      shouldValidate: true,
                    });
                  }
                });
              }
              setValue(`experiences.${index}.current`, checked, {
                shouldValidate: true,
              });
            }}
          />
          <Label
            htmlFor={`current-${index}`}
            className="font-normal text-sm cursor-pointer"
          >
            I currently work here
          </Label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <Label>Description (Markdown supported)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAchievementAssistant(true)}
                className="h-8 gap-1.5 text-xs text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                title="Synthesize evidence-based achievements with STAR questionnaire"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                STAR Assistant
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowQuantifier(true)}
                className="h-8 gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                title="Add realistic metrics and percentage impact with Gemini Nano"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Add Metrics
              </Button>
              <AIHelper
                currentText={watch(`experiences.${index}.description`) || ""}
                onUpdate={(improvedText) =>
                  setValue(`experiences.${index}.description`, improvedText)
                }
                targetId={`exp-${index}-ai-options`}
                sectionType="experience"
              />
              <PowerVerbs
                onSelect={(verb) => {
                  const currentDesc =
                    watch(`experiences.${index}.description`) || "";
                  setValue(
                    `experiences.${index}.description`,
                    currentDesc +
                      (currentDesc && !currentDesc.endsWith(" ") ? " " : "") +
                      verb,
                  );
                }}
              />
            </div>
          </div>
          <Textarea
            placeholder="- Developed new features&#10;- Improved performance by **20%**"
            className="min-h-[100px]"
            {...register(`experiences.${index}.description`)}
          />
          <div id={`exp-${index}-ai-options`} />
          {(() => {
            const desc = watch(`experiences.${index}.description`) || "";
            const weakVerbs = detectWeakActionVerbs(desc);
            if (weakVerbs.length === 0) return null;
            return (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Weak Action Verb Detected:</span>
                </div>
                {weakVerbs.map((wv, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="line-through text-amber-700 dark:text-amber-400 font-mono">
                      &quot;{wv.phrase}&quot;
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      → Replace with:
                    </span>
                    {wv.suggestions.slice(0, 4).map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          const current =
                            watch(`experiences.${index}.description`) || "";
                          setValue(
                            `experiences.${index}.description`,
                            replaceWeakVerb(current, wv.phrase, sug),
                            { shouldValidate: true },
                          );
                        }}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-medium text-[11px] transition-colors shadow-2xs"
                      >
                        +{sug}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}
          <AchievementAssistantModal
            isOpen={showAchievementAssistant}
            onClose={() => setShowAchievementAssistant(false)}
            currentText={watch(`experiences.${index}.description`) || ""}
            onApply={(synthesizedText) => {
              const currentDesc =
                watch(`experiences.${index}.description`) || "";
              if (!currentDesc.trim()) {
                setValue(
                  `experiences.${index}.description`,
                  `- ${synthesizedText}`,
                );
              } else {
                setValue(
                  `experiences.${index}.description`,
                  currentDesc +
                    (currentDesc.endsWith("\n") ? "" : "\n") +
                    `- ${synthesizedText}`,
                );
              }
            }}
          />
          <BulletQuantifierModal
            isOpen={showQuantifier}
            onClose={() => setShowQuantifier(false)}
            currentText={watch(`experiences.${index}.description`) || ""}
            onApply={(quantifiedText) => {
              const currentDesc =
                watch(`experiences.${index}.description`) || "";
              if (!currentDesc.trim()) {
                setValue(
                  `experiences.${index}.description`,
                  `- ${quantifiedText}`,
                );
              } else {
                setValue(
                  `experiences.${index}.description`,
                  currentDesc +
                    (currentDesc.endsWith("\n") ? "" : "\n") +
                    `- ${quantifiedText}`,
                );
              }
            }}
          />
          <AISuggestions
            currentText={watch(`experiences.${index}.description`) || ""}
            onSelect={(suggestion) => {
              const currentDesc =
                watch(`experiences.${index}.description`) || "";
              setValue(
                `experiences.${index}.description`,
                currentDesc +
                  (currentDesc && !currentDesc.endsWith(" ") ? " " : "") +
                  suggestion,
              );
            }}
            contextPrompt="job experience bullet points"
          />
        </div>
      </div>
    </div>
  );
}

export function ExperienceForm() {
  const experiences = useResumeStore((state) => state.data.experience);
  const reorderExperience = useResumeStore((state) => state.reorderExperience);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { experiences },
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "experiences",
  });

  const handleRemove = (index: number) => {
    const removedItem = fields[index];
    remove(index);
    toast("Experience removed", {
      description: removedItem?.company
        ? `${removedItem.company}${removedItem.role ? ` · ${removedItem.role}` : ""}`
        : "Item removed from experience",
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
        if (value.experiences) {
          useResumeStore.setState((state) => ({
            data: {
              ...state.data,
              experience: value.experiences as typeof state.data.experience,
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
      reorderExperience(oldIndex, newIndex);
    }
  };

  const [showGuidedCreator, setShowGuidedCreator] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Work Experience
          </h2>
          <p className="text-sm text-muted-foreground">
            Add your relevant work history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowGuidedCreator(true)}
            variant="outline"
            size="sm"
            className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40"
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Guided Creator
          </Button>
          <Button
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              })
            }
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
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
              <SortableExperienceItem
                key={field.id}
                id={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={handleRemove}
                watch={watch}
                setValue={setValue}
                fields={fields}
              />
            ))}
            {fields.length === 0 && (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-[#27272a] rounded-xl text-zinc-500 dark:text-[#a1a1aa] space-y-3">
                <p className="text-sm">No experience added yet.</p>
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => setShowGuidedCreator(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Use Guided Creator
                  </Button>
                  <Button
                    onClick={() =>
                      append({
                        id: crypto.randomUUID(),
                        company: "",
                        role: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        description: "",
                      })
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Manually
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <GuidedExperienceModal
        isOpen={showGuidedCreator}
        onClose={() => setShowGuidedCreator(false)}
        onApply={(bullets) => {
          const bulletMarkdown = bullets.map((b) => `- ${b}`).join("\n");
          append({
            id: crypto.randomUUID(),
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            current: false,
            description: bulletMarkdown,
          });
        }}
      />
    </div>
  );
}
