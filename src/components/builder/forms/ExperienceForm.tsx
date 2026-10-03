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
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useEffect } from "react";
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
  remove,
  watch,
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
      className="p-4 border border-[#27272a] rounded-xl space-y-4 bg-[#111113] relative group shadow-sm"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-move text-[#a1a1aa] hover:text-[#fafafa]"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#a1a1aa] hover:text-red-400"
          onClick={() => remove(index)}
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
              const event = {
                target: {
                  name: `experiences.${index}.current`,
                  value: checked,
                },
              };
              register(`experiences.${index}.current`).onChange(
                event as unknown as React.ChangeEvent<HTMLInputElement>,
              );
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
          <Label>Description (Markdown supported)</Label>
          <Textarea
            placeholder="- Developed new features&#10;- Improved performance by **20%**"
            className="min-h-[100px]"
            {...register(`experiences.${index}.description`)}
          />
        </div>
      </div>
    </div>
  );
}

export function ExperienceForm() {
  const { data, reorderExperience } = useResumeStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { experiences: data.experience },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "experiences",
  });

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
                remove={remove}
                watch={watch}
              />
            ))}
            {fields.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[#27272a] rounded-xl text-[#a1a1aa]">
                No experience added yet. Click the Add button above.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
