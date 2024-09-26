import { create } from "zustand";

export const useUser = create((set) => ({
  user: null,

  // Set the user object
  setUser: (value) => set(() => ({ user: value })),

  // Update specific fields of the user object
  updateUser: (updatedFields) =>
    set((state) => ({
      user: {
        ...state.user,
        ...updatedFields,
      },
    })),
}));
