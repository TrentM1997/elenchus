import { ActiveToast, ToastKind } from "@/state/Reducers/Overlay/PipelineSlice";

type ToastMessages = Record<ActiveToast["status"], string>;

export type ToastMessageConfig = Record<ToastKind, ToastMessages>;

export const toastMessageConfig = {
  login: {
    idle: "idle",
    pending: "Logging in...",
    failed: "Failed to log in",
    success: "Logged in successfully!",
  },
  logout: {
    idle: "idle",
    pending: "Logging out...",
    failed: "Failed to log out",
    success: "Logged out successfully!",
  },
  signup: {
    idle: "idle",
    pending: "Creating your account...",
    failed: "Failed to create your account",
    success: "Account created successfully!",
  },
  "save investigation": {
    idle: "idle",
    pending: "Saving your investigation...",
    failed: "Failed to save your investigation",
    success: "Investigation saved!",
  },
  "delete account": {
    idle: "idle",
    pending: "Deleting your account...",
    failed: "Failed to delete your account",
    success: "Account deleted successfully!",
  },
  feedback: {
    idle: "idle",
    pending: "submitting feedback...",
    failed: "Failed to submit feedback.",
    success: "Feedback submitted",
  },
} satisfies ToastMessageConfig;
