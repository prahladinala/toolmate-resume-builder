"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "@/lib/validations";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function PersonalInfoForm() {
  const personalInfo = useResumeStore((state) => state.data.personalInfo);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
    mode: "onChange",
  });

  // Watch for changes and update store with debounce
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updatePersonalInfo(value as Parameters<typeof updatePersonalInfo>[0]);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [watch, updatePersonalInfo]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Compress image to prevent localStorage QuotaExceededError
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to highly compressed webp (or jpeg) to keep store under 5MB limit
          const compressedBase64 = canvas.toDataURL("image/webp", 0.8);

          setValue("photoBase64", compressedBase64, {
            shouldValidate: true,
            shouldDirty: true,
          });
          updatePersonalInfo({ photoBase64: compressedBase64 });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("photoBase64", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    updatePersonalInfo({ photoBase64: undefined });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Personal Information
        </h2>
        <p className="text-sm text-muted-foreground">
          This is how employers will contact you.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          {personalInfo.photoBase64 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={personalInfo.photoBase64}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover border"
            />
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="max-w-xs cursor-pointer"
          />
          {personalInfo.photoBase64 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={removeImage}
              className="text-destructive"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" placeholder="John" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {errors.firstName.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" placeholder="Doe" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-xs text-destructive">
              {errors.lastName.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">
              {errors.phone.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            placeholder="Senior Frontend Engineer"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">
              {errors.title.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-xs text-destructive">
              {errors.location.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/..."
            {...register("linkedin")}
          />
          {errors.linkedin && (
            <p className="text-xs text-destructive">
              {errors.linkedin.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            type="url"
            placeholder="https://github.com/..."
            {...register("github")}
          />
          {errors.github && (
            <p className="text-xs text-destructive">
              {errors.github.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
