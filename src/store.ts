import { create } from "zustand";

export const useAuthFlow = create(() => ({
  login: false,
  signup: false,
}));
