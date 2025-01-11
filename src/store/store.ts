import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoreState {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (val) => set({ isAuthenticated: val })
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
