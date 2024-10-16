import { create } from "zustand";

export const useUser = create((set) => ({
  user: null,
  // Set the user object
  setUser: (value) => set(() => ({ user: value })),
}));
export const useFollowers = create((set) => ({
  followers: 0,
  setFollowers: (value) => set(() => ({ followers: value })),
}));
export const usePending = create((set) => ({
  pending: 0,
  setPending: (value) => set(() => ({ pending: value })),
}));
