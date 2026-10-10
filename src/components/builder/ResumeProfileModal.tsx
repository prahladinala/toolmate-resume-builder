"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Plus,
  Trash2,
  Check,
  FolderSync,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  getSavedProfiles,
  saveProfiles,
  createOrCloneProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
  type ResumeProfile,
} from "@/lib/profileManager";
import { notify } from "@/lib/toast";

interface ResumeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeProfileModal({
  isOpen,
  onClose,
}: ResumeProfileModalProps) {
  const { data, activeTemplate, themeConfig } = useResumeStore();
  const [profiles, setProfiles] = useState<ResumeProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadProfiles = useCallback(async () => {
    const list = await getSavedProfiles();
    const currentActive = await getActiveProfileId();

    if (list.length === 0) {
      // Initialize with current profile
      const defaultProfile = await createOrCloneProfile(
        data.personalInfo.title
          ? `${data.personalInfo.title} Resume`
          : "Primary Resume",
        data,
        activeTemplate,
        themeConfig,
      );
      setProfiles([defaultProfile]);
      setActiveId(defaultProfile.id);
    } else {
      setProfiles(list);
      setActiveId(currentActive || list[0].id);
    }
  }, [data, activeTemplate, themeConfig]);

  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen, loadProfiles]);

  const handleSaveCurrentAsActive = async () => {
    if (!activeId) return;
    const updated = profiles.map((p) => {
      if (p.id === activeId) {
        return {
          ...p,
          updatedAt: new Date().toISOString(),
          data: JSON.parse(JSON.stringify(data)),
          activeTemplate,
          themeConfig: JSON.parse(JSON.stringify(themeConfig)),
        };
      }
      return p;
    });

    await saveProfiles(updated);
    setProfiles(updated);
    notify.success("Active resume version saved!");
  };

  const handleSwitchProfile = async (profile: ResumeProfile) => {
    // Sync current changes before switching
    await handleSaveCurrentAsActive();

    // Load selected profile into Zustand store
    useResumeStore.setState({
      data: profile.data,
      activeTemplate: profile.activeTemplate,
      themeConfig: profile.themeConfig,
    });

    await setActiveProfileId(profile.id);
    setActiveId(profile.id);
    notify.success(`Switched to "${profile.name}"!`);
    onClose();
  };

  const handleCloneProfile = async (profileToClone: ResumeProfile) => {
    const cloneName = `${profileToClone.name} (Copy)`;
    await createOrCloneProfile(
      cloneName,
      profileToClone.data,
      profileToClone.activeTemplate,
      profileToClone.themeConfig,
    );

    const updated = await getSavedProfiles();
    setProfiles(updated);
    notify.success(`Cloned resume profile as "${cloneName}"!`);
  };

  const handleCreateNew = async () => {
    if (!newProfileName.trim()) return;
    await createOrCloneProfile(
      newProfileName.trim(),
      data,
      activeTemplate,
      themeConfig,
    );

    const updated = await getSavedProfiles();
    setProfiles(updated);
    const createdName = newProfileName.trim();
    setNewProfileName("");
    setIsCreating(false);
    notify.success(`Created profile "${createdName}"!`);
  };

  const handleDelete = async (id: string) => {
    if (profiles.length <= 1) {
      notify.error("You must keep at least one resume profile.");
      return;
    }

    const updated = await deleteProfile(id);
    setProfiles(updated);
    if (activeId === id) {
      handleSwitchProfile(updated[0]);
    }
    notify.success("Deleted resume profile.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Targeted Resume Profiles
              </h3>
              <p className="text-xs text-zinc-500">
                Manage different resume versions tailored for specific roles or
                companies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold p-1 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-between items-center pb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Saved Profiles ({profiles.length})
            </span>
            <button
              onClick={() => setIsCreating(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              New Profile
            </button>
          </div>

          {isCreating && (
            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-3 animate-in fade-in">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Profile Name / Target Role
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Frontend Specialist, Stripe Application, Lead Architect"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleCreateNew}
                  disabled={!newProfileName.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {profiles.map((prof) => {
              const isActive = activeId === prof.id;
              return (
                <div
                  key={prof.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isActive
                      ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/20"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {prof.name}
                      </h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {prof.targetRole || "Standard Profile"} • Template:{" "}
                      <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                        {prof.activeTemplate}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isActive ? (
                      <button
                        onClick={() => handleSwitchProfile(prof)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-200 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-1 shadow-sm transition-all"
                      >
                        Switch
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveCurrentAsActive}
                        className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1"
                        title="Save current resume state to this profile"
                      >
                        <FolderSync className="w-3.5 h-3.5" />
                        Sync Save
                      </button>
                    )}

                    <button
                      onClick={() => handleCloneProfile(prof)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Clone profile"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {profiles.length > 1 && (
                      <button
                        onClick={() => handleDelete(prof.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
