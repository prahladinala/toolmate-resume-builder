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
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  educations: z.array(educationSchema),
});

export function EducationForm() {
  const { data } = useResumeStore();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educations: data.education,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

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

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-[#27272a] rounded-xl space-y-4 bg-[#111113] relative group shadow-sm"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-[#a1a1aa] hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  placeholder="University of Technology"
                  {...register(`educations.${index}.institution`)}
                />
                {errors.educations?.[index]?.institution && (
                  <p className="text-xs text-destructive">
                    {errors.educations[index].institution.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  placeholder="B.S. Computer Science"
                  {...register(`educations.${index}.degree`)}
                />
                {errors.educations?.[index]?.degree && (
                  <p className="text-xs text-destructive">
                    {errors.educations[index].degree.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  placeholder="Aug 2018"
                  {...register(`educations.${index}.startDate`)}
                />
                {errors.educations?.[index]?.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.educations[index].startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="May 2022"
                  {...register(`educations.${index}.endDate`)}
                  disabled={watch(`educations.${index}.current`)}
                />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id={`current-edu-${index}`}
                  checked={watch(`educations.${index}.current`)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      fields.forEach((_, i) => {
                        if (i !== index) {
                          setValue(`educations.${i}.current`, false, { shouldValidate: true });
                        }
                      });
                    }
                    setValue(`educations.${index}.current`, checked as boolean, { shouldValidate: true });
                  }}
                />
                <Label
                  htmlFor={`current-edu-${index}`}
                  className="font-normal text-sm cursor-pointer"
                >
                  I currently study here
                </Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Score / GPA (Optional)</Label>
                <Input
                  placeholder="3.8 / 4.0"
                  {...register(`educations.${index}.score`)}
                />
              </div>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
            No education added yet. Click the Add button above.
          </div>
        )}
      </div>
    </div>
  );
}
