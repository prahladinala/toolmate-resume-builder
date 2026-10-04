/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableSectionItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

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
      className="flex items-center gap-3 p-3 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] rounded-xl shadow-sm"
    >
      <button
        type="button"
        className="cursor-move text-zinc-400 hover:text-zinc-900 dark:hover:text-[#fafafa] transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <span className="font-medium text-sm text-zinc-700 dark:text-[#e4e4e7] capitalize">{label}</span>
    </div>
  );
}
const COLORS = [
  { id: "zinc-900", label: "Zinc", class: "bg-zinc-900" },
  { id: "slate-800", label: "Slate", class: "bg-slate-800" },
  { id: "gray-900", label: "Gray", class: "bg-gray-900" },
  { id: "neutral-800", label: "Neutral", class: "bg-neutral-800" },
  { id: "stone-700", label: "Stone", class: "bg-stone-700" },
  { id: "red-500", label: "Red", class: "bg-red-500" },
  { id: "orange-500", label: "Orange", class: "bg-orange-500" },
  { id: "amber-600", label: "Amber", class: "bg-amber-600" },
  { id: "emerald-500", label: "Emerald", class: "bg-emerald-500" },
  { id: "emerald-600", label: "Green", class: "bg-emerald-600" },
  { id: "teal-600", label: "Teal", class: "bg-teal-600" },
  { id: "cyan-600", label: "Cyan", class: "bg-cyan-600" },
  { id: "sky-600", label: "Sky", class: "bg-sky-600" },
  { id: "blue-600", label: "Blue", class: "bg-blue-600" },
  { id: "indigo-500", label: "Indigo", class: "bg-indigo-500" },
  { id: "purple-600", label: "Purple", class: "bg-purple-600" },
  { id: "fuchsia-500", label: "Fuchsia", class: "bg-fuchsia-500" },
  { id: "pink-500", label: "Pink", class: "bg-pink-500" },
  { id: "rose-500", label: "Rose", class: "bg-rose-500" },
];

const FONTS = [
  { id: "sans", label: "Sans Serif (Modern)" },
  { id: "serif", label: "Serif (Classic)" },
  { id: "mono", label: "Monospace (Code)" },
];

const IMAGE_ALIGNS = [
  { id: "hidden", label: "Hidden (No Photo)" },
  { id: "left", label: "Left Aligned" },
  { id: "center", label: "Centered" },
  { id: "right", label: "Right Aligned" },
];

const BG_COLORS = [
  { id: "#FFFFFF", label: "Pure White" },
  { id: "#FAFAFA", label: "Off White" },
  { id: "#F9FAFB", label: "Cool Gray" },
  { id: "#FFF5F5", label: "Warm Blush" },
  { id: "#F0FDF4", label: "Mint Hint" },
  { id: "#F0F9FF", label: "Ice Blue" },
];

const TEXT_COLORS = [
  { id: "text-slate-900", label: "Slate", hex: "#0f172a" },
  { id: "text-zinc-900", label: "Zinc", hex: "#18181b" },
  { id: "text-stone-800", label: "Stone", hex: "#292524" },
  { id: "text-blue-900", label: "Navy", hex: "#1e3a8a" },
  { id: "text-emerald-900", label: "Forest", hex: "#064e3b" },
];

const STYLES = [
  { id: "minimal", label: "Minimal (Clean)" },
  { id: "badge", label: "Badge (Modern)" },
  { id: "boxed", label: "Boxed (Card)" },
  { id: "underline", label: "Underline (Classic)" },
];

const SPACINGS = [
  { id: "compact", label: "Compact" },
  { id: "normal", label: "Comfortable" },
  { id: "relaxed", label: "Spacious" },
];

const DATE_FORMATS = [
  { id: "Month YYYY", label: "Nov 2023" },
  { id: "MM/YYYY", label: "11/2023" },
  { id: "YYYY", label: "2023" },
];

export function StyleForm() {
  const { themeConfig, updateThemeConfig } = useResumeStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const sectionOrder = themeConfig?.sectionOrder || [
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over?.id as string);
      updateThemeConfig({
        sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">
          Advanced Style Customization
        </h3>
        <p className="text-sm text-muted-foreground">
          Fine-tune your resume&apos;s colors, typography, layout, and section ordering.
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Section Order
        </Label>
        <p className="text-xs text-zinc-500 dark:text-[#a1a1aa] mb-2">
          Drag and drop to reorder the sections on your resume. This affects the main content flow.
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 flex flex-col">
              {sectionOrder.map((sectionId) => (
                <SortableSectionItem
                  key={sectionId}
                  id={sectionId}
                  label={sectionId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Accent Color (Primary Elements)
        </Label>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => updateThemeConfig({ accentColor: color.id })}
              className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-all hover:scale-110 shadow-sm border-2 ${
                themeConfig?.accentColor === color.id
                  ? "border-white scale-110 ring-2 ring-white/20"
                  : "border-transparent"
              }`}
              title={color.label}
            >
              {themeConfig?.accentColor === color.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Background Paper Color
        </Label>
        <div className="flex flex-wrap gap-3">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => updateThemeConfig({ backgroundColor: bg.id })}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 shadow-sm ${
                themeConfig?.backgroundColor === bg.id
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-110"
                  : "border-slate-300"
              }`}
              style={{ backgroundColor: bg.id }}
              title={bg.label}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Primary Text / Header Color
        </Label>
        <div className="flex flex-wrap gap-3">
          {TEXT_COLORS.map((text) => (
            <button
              key={text.id}
              onClick={() => updateThemeConfig({ headerColor: text.id })}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 shadow-sm ${
                themeConfig?.headerColor === text.id
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-110"
                  : "border-slate-700"
              }`}
              style={{ backgroundColor: text.hex }}
              title={text.label}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
            Typography Style
          </Label>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
          >
            {showAdvanced ? "Hide Advanced Settings" : "Advanced Settings"}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() =>
                updateThemeConfig({
                  fontFamily: font.id as "sans" | "serif" | "mono",
                })
              }
              className={`p-3 sm:p-4 rounded-xl border text-left transition-all ${
                themeConfig?.fontFamily === font.id
                  ? "border-emerald-500 bg-emerald-500/10 text-white shadow-sm"
                  : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
              }`}
            >
              <span
                className={`block text-lg mb-1 font-${font.id} text-zinc-900 dark:text-[#fafafa]`}
              >
                Aa
              </span>
              <span className="text-xs sm:text-sm font-medium">
                {font.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {showAdvanced && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pt-2">
          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
              Section & Badge Layout
            </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() =>
                updateThemeConfig({
                  sectionStyle: style.id as
                    "minimal" | "badge" | "boxed" | "underline",
                })
              }
              className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                themeConfig?.sectionStyle === style.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
              }`}
            >
              {style.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Profile Photo Layout
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {IMAGE_ALIGNS.map((align) => (
            <button
              key={align.id}
              onClick={() =>
                updateThemeConfig({
                  imageAlign: align.id as
                    "left" | "center" | "right" | "hidden",
                })
              }
              className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                themeConfig?.imageAlign === align.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
              }`}
            >
              {align.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Layout Spacing
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {SPACINGS.map((spacing) => (
            <button
              key={spacing.id}
              onClick={() =>
                updateThemeConfig({
                  spacing: spacing.id as "compact" | "normal" | "relaxed",
                })
              }
              className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                (themeConfig?.spacing || "normal") === spacing.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
              }`}
            >
              {spacing.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
          Date Formatting
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {DATE_FORMATS.map((format) => (
            <button
              key={format.id}
              onClick={() =>
                updateThemeConfig({
                  dateFormat: format.id as "MM/YYYY" | "Month YYYY" | "YYYY",
                })
              }
              className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                (themeConfig?.dateFormat || "Month YYYY") === format.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-200 dark:border-[#27272a]">
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113]">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
              Show Contact Icons
            </Label>
            <p className="text-xs text-zinc-500 dark:text-[#a1a1aa]">
              Display icons next to email, phone, and links
            </p>
          </div>
          <button
            onClick={() =>
              updateThemeConfig({
                showContactIcons:
                  themeConfig?.showContactIcons !== false ? false : true,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              themeConfig?.showContactIcons !== false
                ? "bg-emerald-500"
                : "bg-[#3f3f46]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                themeConfig?.showContactIcons !== false
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
