import { create } from "zustand";

interface DialogStore {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  toggleDialog: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  isDialogOpen: false,
  setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
  toggleDialog: () => set((state) => ({ isDialogOpen: !state.isDialogOpen })),
}));
