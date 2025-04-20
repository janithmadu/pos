import { Category } from "@/components/ProductAddingForm/ProductAddinFormZodSchema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTokenStore } from "./useTokenStore";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean; // Add this flag
  fetchCategories: (token: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      loading: false,
      error: null,
      hasFetched: false, // Initialize as false

      fetchCategories: async (token: string) => {
        set({ loading: true, error: null });

        try {
          const res = await fetch("/api/protect/category", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch data");

          const data = await res.json();
          set({
            categories: data.getCategory,
            loading: false,
            hasFetched: true,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: "category-storage",
    }
  )
);
