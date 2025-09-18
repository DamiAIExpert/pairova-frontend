import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthFlow = create(() => ({
  login: false,
  signup: false,
}));

// export const useUser = create(() => ({
//   user: "",
// }));

export const useUser = create<{ user: string }>()(
  persist(
    () => ({
      user: "",
    }),
    {
      name: "user",
    }
  )
);
