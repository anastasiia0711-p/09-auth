import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraftState {
  title: string;
  content: string;
  tag: string;
  setDraft: (field: "title" | "content" | "tag", value: string) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      title: "",
      content: "",
      tag: "Todo",
      setDraft: (field, value) =>
        set((state) => ({ ...state, [field]: value })),
      clearDraft: () => set({ title: "", content: "", tag: "Todo" }),
    }),
    {
      name: "note-draft-storage",
    },
  ),
);
