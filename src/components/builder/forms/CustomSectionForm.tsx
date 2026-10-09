/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useEffect } from "react";
import { AIHelper } from "../AIHelper";
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

const customSectionSchema = z.object({
  customSections: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Section title is required"),
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, "Item name is required"),
          description: z.string().optional(),
          date: z.string().optional(),
        }),
      ),
    }),
  ),
});

function SortableItem({
  id,
  index,
  sectionIndex,
  register,
  remove,
  watch,
  setValue,
}: {
  id: string;
  index: number;
  sectionIndex: number;
  register: any;
  remove: any;
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
      className="p-3 border border-zinc-200 dark:border-[#27272a] rounded-lg space-y-3 bg-white dark:bg-[#09090b] relative group"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-move text-zinc-500 hover:text-zinc-900 dark:text-[#a1a1aa] dark:hover:text-[#fafafa]"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-500 hover:text-red-400 dark:text-[#a1a1aa]"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
        <div className="space-y-1">
          <Label className="text-xs">Name / Title *</Label>
          <Input
            className="h-8 text-sm"
            placeholder="e.g. Spanish"
            {...register(`customSections.${sectionIndex}.items.${index}.name`)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Date / Level (Optional)</Label>
          <Input
            className="h-8 text-sm"
            placeholder="e.g. Native Bilingual"
            {...register(`customSections.${sectionIndex}.items.${index}.date`)}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Description (Optional)</Label>
            <div className="flex items-center gap-2">
              <AIHelper
                currentText={
                  (watch &&
                    watch(
                      `customSections.${sectionIndex}.items.${index}.description`,
                    )) ||
                  ""
                }
                onUpdate={(improvedText) => {
                  if (setValue) {
                    setValue(
                      `customSections.${sectionIndex}.items.${index}.description`,
                      improvedText,
                      { shouldValidate: true },
                    );
                  }
                }}
                targetId={`custom-${sectionIndex}-${index}-ai-options`}
                sectionType="custom"
              />
            </div>
          </div>
          <Textarea
            className="min-h-[60px] text-sm"
            placeholder="Additional details..."
            {...register(
              `customSections.${sectionIndex}.items.${index}.description`,
            )}
          />
          <div id={`custom-${sectionIndex}-${index}-ai-options`} />
        </div>
      </div>
    </div>
  );
}

function SectionEditor({
  sectionIndex,
  control,
  register,
  removeSection,
  watch,
  setValue,
}: {
  sectionIndex: number;
  control: any;
  register: any;
  removeSection: any;
  watch: any;
  setValue: any;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `customSections.${sectionIndex}.items`,
  });

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
    }
  };

  return (
    <div className="p-4 border border-zinc-200 dark:border-[#27272a] rounded-xl space-y-4 bg-zinc-50 dark:bg-[#111113] shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Label>Section Title *</Label>
          <Input
            placeholder="e.g. Certifications, Languages, Awards"
            {...register(`customSections.${sectionIndex}.title`)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mt-6 text-zinc-500 hover:text-red-400 dark:text-[#a1a1aa]"
          onClick={() => removeSection(sectionIndex)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="pt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {fields.map((field, index) => (
                <SortableItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  sectionIndex={sectionIndex}
                  register={register}
                  remove={remove}
                  watch={watch}
                  setValue={setValue}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Button
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              name: "",
              description: "",
              date: "",
            })
          }
          variant="outline"
          size="sm"
          className="mt-3 w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>
    </div>
  );
}

export function CustomSectionForm() {
  const { data } = useResumeStore();

  const { register, control, watch, setValue } = useForm({
    resolver: zodResolver(customSectionSchema),
    defaultValues: {
      customSections: data.customSections || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customSections",
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (value.customSections) {
          useResumeStore.setState((state) => ({
            data: {
              ...state.data,
              customSections: value.customSections,
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Custom Sections
          </h2>
          <p className="text-sm text-muted-foreground">
            Add custom lists for Languages, Certifications, Awards, etc.
          </p>
        </div>
        <Button
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              title: "",
              items: [],
            })
          }
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <SectionEditor
            key={field.id}
            sectionIndex={index}
            control={control}
            register={register}
            removeSection={remove}
            watch={watch}
            setValue={setValue}
          />
        ))}
        {fields.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-[#27272a] rounded-xl text-zinc-500 dark:text-[#a1a1aa]">
            No custom sections added yet. Click the Add Section button above.
          </div>
        )}
      </div>
    </div>
  );
}
