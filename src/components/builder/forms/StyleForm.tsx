/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState } from "react";
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
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Terminal,
  Star,
  Columns,
  LayoutList,
  ShieldCheck,
} from "lucide-react";
import { checkContrast } from "@/lib/contrastChecker";

function getSectionIcon(id: string) {
  if (id === "summary") return User;
  if (id === "experience") return Briefcase;
  if (id === "projects") return Terminal;
  if (id === "education") return GraduationCap;
  if (id === "skills") return Lightbulb;
  return Star;
}

function getSectionTitle(
  id: string,
  customSections?: Array<{ id: string; title: string }>,
): string {
  if (id === "summary") return "Professional Summary";
  if (id === "experience") return "Work Experience";
  if (id === "projects") return "Projects";
  if (id === "education") return "Education";
  if (id === "skills") return "Skills";
  if (id.startsWith("custom-")) {
    const customId = id.replace("custom-", "");
    const found = customSections?.find((cs) => cs.id === customId);
    return found?.title || "Custom Section";
  }
  return id;
}

function SortableSectionItem({
  id,
  title,
  isCustom,
  icon: Icon,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onSwitchColumn,
  switchColumnLabel,
}: {
  id: string;
  title: string;
  isCustom: boolean;
  icon: React.ComponentType<{ className?: string }>;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSwitchColumn?: () => void;
  switchColumnLabel?: string;
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
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors touch-none"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 shrink-0" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-xs sm:text-sm text-zinc-800 dark:text-[#fafafa] truncate">
            {title}
          </span>
          {isCustom && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shrink-0">
              Custom
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onMoveUp && (
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            title="Move Up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            title="Move Down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
        {onSwitchColumn && (
          <button
            type="button"
            onClick={onSwitchColumn}
            className="ml-1 px-2 py-1 rounded-md text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors flex items-center gap-1"
            title={switchColumnLabel}
          >
            {switchColumnLabel?.includes("Sidebar") ? (
              <ArrowRight className="w-3 h-3 text-purple-500" />
            ) : (
              <ArrowLeft className="w-3 h-3 text-purple-500" />
            )}
            <span className="hidden sm:inline">{switchColumnLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
const COLORS = [
  { id: "zinc-900", label: "Zinc", class: "bg-zinc-900", hex: "#18181b" },
  { id: "slate-800", label: "Slate", class: "bg-slate-800", hex: "#1e293b" },
  { id: "gray-900", label: "Gray", class: "bg-gray-900", hex: "#111827" },
  {
    id: "neutral-800",
    label: "Neutral",
    class: "bg-neutral-800",
    hex: "#262626",
  },
  { id: "stone-700", label: "Stone", class: "bg-stone-700", hex: "#44403c" },
  { id: "red-500", label: "Red", class: "bg-red-500", hex: "#ef4444" },
  { id: "orange-500", label: "Orange", class: "bg-orange-500", hex: "#f97316" },
  { id: "amber-600", label: "Amber", class: "bg-amber-600", hex: "#d97706" },
  {
    id: "emerald-500",
    label: "Emerald",
    class: "bg-emerald-500",
    hex: "#10b981",
  },
  {
    id: "emerald-600",
    label: "Green",
    class: "bg-emerald-600",
    hex: "#059669",
  },
  { id: "teal-600", label: "Teal", class: "bg-teal-600", hex: "#0d9488" },
  { id: "cyan-600", label: "Cyan", class: "bg-cyan-600", hex: "#0891b2" },
  { id: "sky-600", label: "Sky", class: "bg-sky-600", hex: "#0284c7" },
  { id: "blue-600", label: "Blue", class: "bg-blue-600", hex: "#2563eb" },
  { id: "indigo-500", label: "Indigo", class: "bg-indigo-500", hex: "#6366f1" },
  { id: "purple-600", label: "Purple", class: "bg-purple-600", hex: "#9333ea" },
  {
    id: "fuchsia-500",
    label: "Fuchsia",
    class: "bg-fuchsia-500",
    hex: "#d946ef",
  },
  { id: "pink-500", label: "Pink", class: "bg-pink-500", hex: "#ec4899" },
  { id: "rose-500", label: "Rose", class: "bg-rose-500", hex: "#f43f5e" },
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
  { id: "timeline", label: "Timeline (Journey)" },
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

const BORDER_RADIUS = [
  { id: "none", label: "Sharp" },
  { id: "md", label: "Rounded" },
  { id: "full", label: "Pill" },
];

const TEXT_SIZES = [
  { id: "sm", label: "Small" },
  { id: "base", label: "Normal" },
  { id: "lg", label: "Large" },
];

export function StyleForm() {
  const { themeConfig, updateThemeConfig, data } = useResumeStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState<"main" | "sidebar">(
    "main",
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // All valid custom sections in current resume
  const customSections = data?.customSections || [];
  const customSectionIds = customSections.map((cs) => `custom-${cs.id}`);

  // Base default ordering
  const defaultMain = [
    "summary",
    "experience",
    "projects",
    ...customSectionIds,
  ];
  const defaultSidebar = ["skills", "education"];

  // Resolve current active main and sidebar orders
  const activeMain: string[] = (
    themeConfig?.mainSectionOrder || defaultMain
  ).filter((id) => !id.startsWith("custom-") || customSectionIds.includes(id));

  const activeSidebar: string[] = (
    themeConfig?.sidebarSectionOrder || defaultSidebar
  ).filter((id) => !id.startsWith("custom-") || customSectionIds.includes(id));

  // Ensure any custom sections not yet in main or sidebar are added to main
  customSectionIds.forEach((cId) => {
    if (!activeMain.includes(cId) && !activeSidebar.includes(cId)) {
      activeMain.push(cId);
    }
  });

  const handleMainDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = activeMain.indexOf(active.id as string);
      const newIndex = activeMain.indexOf(over?.id as string);
      const newMain = arrayMove(activeMain, oldIndex, newIndex);
      updateThemeConfig({
        mainSectionOrder: newMain,
        sidebarSectionOrder: activeSidebar,
        sectionOrder: [...newMain, ...activeSidebar],
      });
    }
  };

  const handleSidebarDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = activeSidebar.indexOf(active.id as string);
      const newIndex = activeSidebar.indexOf(over?.id as string);
      const newSidebar = arrayMove(activeSidebar, oldIndex, newIndex);
      updateThemeConfig({
        mainSectionOrder: activeMain,
        sidebarSectionOrder: newSidebar,
        sectionOrder: [...activeMain, ...newSidebar],
      });
    }
  };

  const moveMainItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= activeMain.length) return;
    const newMain = arrayMove(activeMain, index, targetIndex);
    updateThemeConfig({
      mainSectionOrder: newMain,
      sidebarSectionOrder: activeSidebar,
      sectionOrder: [...newMain, ...activeSidebar],
    });
  };

  const moveSidebarItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= activeSidebar.length) return;
    const newSidebar = arrayMove(activeSidebar, index, targetIndex);
    updateThemeConfig({
      mainSectionOrder: activeMain,
      sidebarSectionOrder: newSidebar,
      sectionOrder: [...activeMain, ...newSidebar],
    });
  };

  const moveToSidebar = (id: string) => {
    const newMain = activeMain.filter((item) => item !== id);
    const newSidebar = [...activeSidebar, id];
    updateThemeConfig({
      mainSectionOrder: newMain,
      sidebarSectionOrder: newSidebar,
      sectionOrder: [...newMain, ...newSidebar],
    });
  };

  const moveToMain = (id: string) => {
    const newSidebar = activeSidebar.filter((item) => item !== id);
    const newMain = [...activeMain, id];
    updateThemeConfig({
      mainSectionOrder: newMain,
      sidebarSectionOrder: newSidebar,
      sectionOrder: [...newMain, ...newSidebar],
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">
          Advanced Style Customization
        </h3>
        <p className="text-sm text-muted-foreground">
          Fine-tune your resume&apos;s colors, typography, layout, and section
          ordering.
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-[#27272a]">
        <div>
          <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
            Section Order & Column Layout
          </Label>
          <p className="text-xs text-zinc-500 dark:text-[#a1a1aa] mt-0.5">
            Customize section flow in Main Content and Sidebar. Custom sections
            automatically appear using their configured titles.
          </p>
        </div>

        {/* Tab switch between Main Content Order and Sidebar Order */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveOrderTab("main")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeOrderTab === "main"
                ? "bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5 text-purple-500" />
            <span>Main Content Order</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {activeMain.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOrderTab("sidebar")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeOrderTab === "sidebar"
                ? "bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-purple-500" />
            <span>Sidebar Order</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {activeSidebar.length}
            </span>
          </button>
        </div>

        {/* Active tab content */}
        {activeOrderTab === "main" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pb-1">
              <span>Main column sections (drag or use arrows):</span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                Tip: Click &quot;→ Sidebar&quot; to relocate
              </span>
            </div>

            {activeMain.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-400">
                No sections in Main Content. Move sections here from the Sidebar
                tab.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleMainDragEnd}
              >
                <SortableContext
                  items={activeMain}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 flex flex-col">
                    {activeMain.map((sectionId, idx) => (
                      <SortableSectionItem
                        key={sectionId}
                        id={sectionId}
                        title={getSectionTitle(sectionId, customSections)}
                        isCustom={sectionId.startsWith("custom-")}
                        icon={getSectionIcon(sectionId)}
                        canMoveUp={idx > 0}
                        canMoveDown={idx < activeMain.length - 1}
                        onMoveUp={() => moveMainItem(idx, -1)}
                        onMoveDown={() => moveMainItem(idx, 1)}
                        onSwitchColumn={() => moveToSidebar(sectionId)}
                        switchColumnLabel="→ Sidebar"
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pb-1">
              <span>Sidebar sections (used in 2-column templates):</span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                Tip: Click &quot;← Main&quot; to relocate
              </span>
            </div>

            {activeSidebar.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-400">
                No sections in Sidebar. Move sections here from the Main Content
                tab.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSidebarDragEnd}
              >
                <SortableContext
                  items={activeSidebar}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 flex flex-col">
                    {activeSidebar.map((sectionId, idx) => (
                      <SortableSectionItem
                        key={sectionId}
                        id={sectionId}
                        title={getSectionTitle(sectionId, customSections)}
                        isCustom={sectionId.startsWith("custom-")}
                        icon={getSectionIcon(sectionId)}
                        canMoveUp={idx > 0}
                        canMoveDown={idx < activeSidebar.length - 1}
                        onMoveUp={() => moveSidebarItem(idx, -1)}
                        onMoveDown={() => moveSidebarItem(idx, 1)}
                        onSwitchColumn={() => moveToMain(sectionId)}
                        switchColumnLabel="← Main"
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-[#27272a]">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
            Accent Color & Palette
          </Label>
          <span className="text-[11px] text-zinc-400 font-medium">
            Presets & Custom HEX
          </span>
        </div>

        {/* Preset Swatches */}
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
              title={`${color.label} (${color.hex})`}
            >
              {themeConfig?.accentColor === color.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Custom HEX Picker & WCAG Contrast Check */}
        {(() => {
          const currentAccent = themeConfig?.accentColor || "zinc-900";
          const currentBg = themeConfig?.backgroundColor || "#FFFFFF";
          const matchedPreset = COLORS.find((c) => c.id === currentAccent);
          const activeHex = currentAccent.startsWith("#")
            ? currentAccent
            : matchedPreset?.hex || "#18181b";

          const contrast = checkContrast(activeHex, currentBg);

          return (
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-[#18181b]/30 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 shadow-2xs shrink-0"
                    style={{ backgroundColor: activeHex }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                      Custom HEX Color
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {activeHex.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeHex}
                    onChange={(e) =>
                      updateThemeConfig({ accentColor: e.target.value })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-800"
                    title="Open Color Wheel"
                  />
                  <input
                    type="text"
                    value={activeHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith("#") || val.length <= 7) {
                        updateThemeConfig({ accentColor: val });
                      }
                    }}
                    placeholder="#18181B"
                    maxLength={7}
                    className="w-24 text-xs font-mono uppercase px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* WCAG Contrast Ratio Live Badge */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                    WCAG 2.1 Contrast:
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {contrast.ratioText}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${contrast.ratingColor}`}
                >
                  {contrast.rating} {contrast.isAaPassed ? "Pass" : "Warning"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                {contrast.message}
              </p>
            </div>
          );
        })()}
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
                  titleFont: font.id as "sans" | "serif" | "mono",
                  headingFont: font.id as "sans" | "serif" | "mono",
                  bodyFont: font.id as "sans" | "serif" | "mono",
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
          <div className="space-y-5 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
              Advanced Typography
            </Label>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-500 dark:text-[#a1a1aa]">
                  Name & Main Title
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={`title-${font.id}`}
                      onClick={() =>
                        updateThemeConfig({
                          titleFont: font.id as "sans" | "serif" | "mono",
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        (themeConfig?.titleFont ||
                          themeConfig?.fontFamily ||
                          "sans") === font.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                      }`}
                    >
                      <span className={`font-${font.id}`}>
                        {font.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-500 dark:text-[#a1a1aa]">
                  Section Headings
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={`heading-${font.id}`}
                      onClick={() =>
                        updateThemeConfig({
                          headingFont: font.id as "sans" | "serif" | "mono",
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        (themeConfig?.headingFont ||
                          themeConfig?.fontFamily ||
                          "sans") === font.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                      }`}
                    >
                      <span className={`font-${font.id}`}>
                        {font.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-500 dark:text-[#a1a1aa]">
                  Body Content
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={`body-${font.id}`}
                      onClick={() =>
                        updateThemeConfig({
                          bodyFont: font.id as "sans" | "serif" | "mono",
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        (themeConfig?.bodyFont ||
                          themeConfig?.fontFamily ||
                          "sans") === font.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                      }`}
                    >
                      <span className={`font-${font.id}`}>
                        {font.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

          {(themeConfig?.sectionStyle === "badge" ||
            themeConfig?.sectionStyle === "boxed") && (
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                Border Radius
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {BORDER_RADIUS.map((radius) => (
                  <button
                    key={radius.id}
                    onClick={() =>
                      updateThemeConfig({
                        borderRadius: radius.id as "none" | "md" | "full",
                      })
                    }
                    className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                      (themeConfig?.borderRadius || "none") === radius.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                        : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                    }`}
                  >
                    {radius.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {themeConfig?.sectionStyle === "badge" && (
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                  Show Section Icons
                </Label>
                <button
                  onClick={() =>
                    updateThemeConfig({
                      hideSectionIcons: !themeConfig?.hideSectionIcons,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${!themeConfig?.hideSectionIcons ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${!themeConfig?.hideSectionIcons ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>
            </div>
          )}

          {themeConfig?.sectionStyle === "boxed" && (
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                Box Background Color
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: "bg-slate-50 dark:bg-[#111113]",
                    label: "Theme Default",
                  },
                  {
                    id: "transparent border border-zinc-200 dark:border-zinc-800",
                    label: "Transparent (Outline)",
                  },
                  { id: "bg-white dark:bg-[#18181b]", label: "Solid Paper" },
                  { id: "bg-zinc-100 dark:bg-zinc-900", label: "Contrast" },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() =>
                      updateThemeConfig({ boxBackgroundColor: bg.id })
                    }
                    className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${(themeConfig?.boxBackgroundColor || "bg-slate-50 dark:bg-[#111113]") === bg.id ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm" : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 hover:border-[#3f3f46]"}`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {themeConfig?.sectionStyle === "timeline" && (
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                Timeline Dot Style
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "solid", label: "Solid Filled" },
                  { id: "hollow", label: "Hollow Outline" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      updateThemeConfig({
                        timelineStyle: s.id as "solid" | "hollow",
                      })
                    }
                    className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                      (themeConfig?.timelineStyle || "solid") === s.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                        : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 hover:border-[#3f3f46]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              Body Text Size
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {TEXT_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() =>
                    updateThemeConfig({
                      textSize: size.id as "sm" | "base" | "lg",
                    })
                  }
                  className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                    (themeConfig?.textSize || "base") === size.id
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                      : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                  }`}
                >
                  {size.label}
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
                      dateFormat: format.id as
                        "MM/YYYY" | "Month YYYY" | "YYYY",
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

          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                Page Margin
              </Label>
              <span className="text-xs font-medium text-emerald-500">
                {themeConfig?.pageMargin !== undefined
                  ? themeConfig.pageMargin
                  : 32}
                px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="4"
              value={
                themeConfig?.pageMargin !== undefined
                  ? themeConfig.pageMargin
                  : 32
              }
              onChange={(e) =>
                updateThemeConfig({ pageMargin: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-zinc-200 dark:bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 dark:text-[#a1a1aa] font-medium uppercase tracking-wider">
              <span>Edge-to-Edge</span>
              <span>Spacious</span>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
              Field Visibility
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "hidePhoto", label: "Profile Photo" },
                { id: "hidePhone", label: "Phone Number" },
                { id: "hideEmail", label: "Email Address" },
                { id: "hideLocation", label: "Location" },
                { id: "hideLinks", label: "Social Links" },
                { id: "hideDates", label: "Experience Dates" },
              ].map((field) => (
                <button
                  key={field.id}
                  onClick={() =>
                    updateThemeConfig({
                      [field.id]:
                        !themeConfig?.[field.id as keyof typeof themeConfig],
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition-all text-sm font-medium flex items-center justify-between ${
                    !themeConfig?.[field.id as keyof typeof themeConfig]
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46] line-through opacity-70"
                  }`}
                >
                  <span>{field.label}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${!themeConfig?.[field.id as keyof typeof themeConfig] ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Skill Display Style ── */}
          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
              Skills Display Style
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "badge", label: "Badge (Pill)" },
                { id: "tag", label: "Tag (Outline)" },
                { id: "grid", label: "Grid Cards" },
                { id: "list", label: "Plain List" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    updateThemeConfig({
                      skillStyle: s.id as "badge" | "list" | "grid" | "tag",
                    })
                  }
                  className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                    (themeConfig?.skillStyle || "badge") === s.id
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                      : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Letter Spacing ── */}
          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
              Heading Letter Spacing
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "tight", label: "Tight" },
                { id: "normal", label: "Normal" },
                { id: "wide", label: "Wide" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    updateThemeConfig({
                      letterSpacing: s.id as "tight" | "normal" | "wide",
                    })
                  }
                  className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                    (themeConfig?.letterSpacing || "normal") === s.id
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                      : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-[#a1a1aa] hover:border-[#3f3f46]"
                  }`}
                >
                  <span
                    className={
                      s.id === "tight"
                        ? "tracking-tight"
                        : s.id === "wide"
                          ? "tracking-widest"
                          : ""
                    }
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Heading Case ── */}
          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a]">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                Uppercase Section Headings
              </Label>
              <button
                onClick={() =>
                  updateThemeConfig({
                    headingUppercase:
                      themeConfig?.headingUppercase === false ? true : false,
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${themeConfig?.headingUppercase !== false ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${themeConfig?.headingUppercase !== false ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
          </div>

          {/* ── Timeline Line Style (when timeline is selected) ── */}
          {themeConfig?.sectionStyle === "timeline" && (
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                Timeline Line Style
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "solid", label: "Solid" },
                  { id: "dashed", label: "Dashed" },
                  { id: "dotted", label: "Dotted" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      updateThemeConfig({
                        timelineLineStyle: s.id as
                          "solid" | "dashed" | "dotted",
                      })
                    }
                    className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                      (themeConfig?.timelineLineStyle || "solid") === s.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                        : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 hover:border-[#3f3f46]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Badge Icon Shape & Size (when badge is selected) ── */}
          {themeConfig?.sectionStyle === "badge" && (
            <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                  Icon Shape
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "circle", label: "Circle" },
                    { id: "square", label: "Square" },
                    { id: "none", label: "No Shape" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        updateThemeConfig({
                          iconShape: s.id as "circle" | "square" | "none",
                        })
                      }
                      className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                        (themeConfig?.iconShape || "circle") === s.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                          : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 hover:border-[#3f3f46]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-zinc-900 dark:text-[#fafafa]">
                  Icon Size
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "sm", label: "Small" },
                    { id: "md", label: "Medium" },
                    { id: "lg", label: "Large" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        updateThemeConfig({
                          iconSize: s.id as "sm" | "md" | "lg",
                        })
                      }
                      className={`p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                        (themeConfig?.iconSize || "md") === s.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                          : "border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-500 hover:border-[#3f3f46]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
