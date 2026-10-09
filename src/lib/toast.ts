import { toast } from "sonner";

/**
 * Scenario-based Toast Notification Helper
 * Eliminates all blocking window.alert() calls with beautiful, non-intrusive toasts.
 */
export const notify = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 4000,
    });
  },

  error: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void },
  ) => {
    toast.error(title, {
      description,
      duration: 6000,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },

  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 4000,
    });
  },

  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description,
      duration: 5000,
    });
  },

  /**
   * Scenario: Gemini Nano AI operation failure
   */
  aiError: (message?: string, onOpenSetup?: () => void) => {
    toast.error("Gemini Nano AI could not process text", {
      description:
        message ||
        "Please check if Chrome AI flags are enabled and model download has finished in chrome://components.",
      duration: 7000,
      action: onOpenSetup
        ? {
            label: "Open Setup",
            onClick: onOpenSetup,
          }
        : undefined,
    });
  },

  /**
   * Scenario: AI generation success
   */
  aiSuccess: (description = "ATS-optimized phrasing applied.") => {
    toast.success("Text enhanced with Gemini Nano ✨", {
      description,
      duration: 3500,
    });
  },

  /**
   * Scenario: Copy link or flag to clipboard
   */
  copied: (item = "Link") => {
    toast.success(`${item} copied to clipboard! 📋`, {
      description: "You can now paste it into a new tab.",
      duration: 3000,
    });
  },
};
