/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationSchema } from "@/lib/validations";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useEffect } from "react";
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
  educations: z.array(educationSchema),
});

function SortableEducationItem({
  id,
  index,
  register,
  errors,
  onRemove,
  watch,
  setValue,
  fields,
}: {
  id: string;
  index: number;
  register: unknown;
  errors: unknown;
  onRemove: (index: number) => void;
  watch: unknown;
  setValue: unknown;
  fields: unknown[];
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

  const reg = register as unknown as (name: string) => object;
  const err = errors as Record<string, unknown>;
  const w = watch as unknown as (name: string) => unknown;
  const setV = setValue as unknown as (name: string, value: unknown) => void;

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
          <Label>Institution *</Label>
          <Input
            placeholder="University of Technology"
            {...reg(`educations.${index}.institution`)}
          />
          {err.educations?.[index]?.institution && (
            <p className="text-xs text-destructive">
              {err.educations[index].institution.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Degree *</Label>
          <Input
            placeholder="B.S. Computer Science"
            {...reg(`educations.${index}.degree`)}
          />
          {err.educations?.[index]?.degree && (
            <p className="text-xs text-destructive">
              {err.educations[index].degree.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            placeholder="Aug 2018"
            {...reg(`educations.${index}.startDate`)}
          />
          {err.educations?.[index]?.startDate && (
            <p className="text-xs text-destructive">
              {err.educations[index].startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            placeholder="May 2022"
            {...reg(`educations.${index}.endDate`)}
            disabled={w(`educations.${index}.current`)}
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id={`current-edu-${index}`}
            checked={w(`educations.${index}.current`)}
            onCheckedChange={(checked) => {
              if (checked) {
                fields.forEach((_: unknown, i: number) => {
                  if (i !== index) {
                    setV(`educations.${i}.current`, false, {
                      shouldValidate: true,
                    });
                  }
                });
              }
              setV(`educations.${index}.current`, checked as boolean, {
                shouldValidate: true,
              });
            }}
          />
          <Label
            htmlFor={`current-edu-${index}`}
            className="font-normal text-sm cursor-pointer text-zinc-500 dark:text-[#a1a1aa]"
          >
            I currently study here
          </Label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Score / GPA (Optional)</Label>
          <Input
            placeholder="3.8 / 4.0"
            {...reg(`educations.${index}.score`)}
          />
        </div>
      </div>
    </div>
  );
}

export function EducationForm() {
  const educations = useResumeStore((state) => state.data.education);
  const reorderEducation = useResumeStore((state) => state.reorderEducation);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educations,
    },
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "educations",
  });

  const handleRemove = (index: number) => {
    const removedItem = fields[index];
    remove(index);
    toast("Education entry removed", {
      description: removedItem?.institution
        ? `${removedItem.institution}${removedItem.degree ? ` · ${removedItem.degree}` : ""}`
        : "Item removed from education",
      action: {
        label: "Undo",
        onClick: () => {
          insert(index, removedItem);
        },
      },
    });
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.educations) {
        useResumeStore.setState((state) => ({
          data: {
            ...state.data,
            education: value.educations as typeof state.data.education,
          },
        }));
      }
    });
    return () => subscription.unsubscribe();
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
      reorderEducation(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
          <p className="text-sm text-muted-foreground">
            Add your academic background.
          </p>
        </div>
        <Button
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              institution: "",
              degree: "",
              startDate: "",
              endDate: "",
              current: false,
              score: "",
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
          <div className="space-y-8">
            {fields.map((field, index) => (
              <SortableEducationItem
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
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-[#27272a] rounded-xl text-zinc-500 dark:text-[#a1a1aa]">
                No education added yet. Click the Add button above.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
