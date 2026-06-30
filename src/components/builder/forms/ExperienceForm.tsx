"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { experienceSchema } from '@/lib/validations';
import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  experiences: z.array(experienceSchema),
});

export function ExperienceForm() {
  const { data } = useResumeStore();
  
  const { register, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experiences: data.experience,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences"
  });

  // Watch for all changes and sync to store
  useEffect(() => {
    const subscription = watch((value) => {
      // Because we're using FieldArray, we just sync the whole array back to Zustand
      // in a real large app we might optimize this, but for < 10 items it's fine.
      if (value.experiences) {
        useResumeStore.setState(state => ({
          data: { ...state.data, experience: value.experiences as typeof state.data.experience }
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Work Experience</h2>
          <p className="text-sm text-muted-foreground">Add your relevant work history.</p>
        </div>
        <Button 
          onClick={() => append({ id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' })}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add 
        </Button>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-xl space-y-4 bg-muted/20 relative group">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input placeholder="Acme Inc." {...register(`experiences.${index}.company`)} />
                {errors.experiences?.[index]?.company && (
                  <p className="text-xs text-destructive">{errors.experiences[index].company.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Input placeholder="Software Engineer" {...register(`experiences.${index}.role`)} />
                {errors.experiences?.[index]?.role && (
                  <p className="text-xs text-destructive">{errors.experiences[index].role.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input placeholder="Jan 2020" {...register(`experiences.${index}.startDate`)} />
                {errors.experiences?.[index]?.startDate && (
                  <p className="text-xs text-destructive">{errors.experiences[index].startDate.message}</p>
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
                    // Manually trigger the register update for boolean
                    const event = { target: { name: `experiences.${index}.current`, value: checked } };
                    register(`experiences.${index}.current`).onChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                />
                <Label htmlFor={`current-${index}`} className="font-normal text-sm cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="- Developed new features&#10;- Improved performance by 20%" 
                  className="min-h-[100px]"
                  {...register(`experiences.${index}.description`)} 
                />
              </div>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
            No experience added yet. Click the Add button above.
          </div>
        )}
      </div>
    </div>
  );
}
