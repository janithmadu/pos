// import { Category } from "@/components/ProductAddingForm/ProductAddinFormZodSchema";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface CategoryState {
//   categories: Category[];
//   loading: boolean;
//   error: string | null;
//   fetchCategories: () => Promise<void>;
// }

// export const useCategoryStore = create<CategoryState>()(
//   persist(
//     (set) => ({
//       categories: [],
//       loading: false,
//       error: null,

//       fetchCategories: async () => {
//         set({ loading: true, error: null });

//         try {
//           const res = await fetch("/api/protect/category"); // Fetch categories API
//           if (!res.ok) throw new Error("Failed to fetch data");

//           const data = await res.json();
//           set({ categories: data, loading: false });
//         } catch (err: any) {
//           set({ error: err.message, loading: false });
//         }
//       },
//     }),
//     {
//       name: "category-storage", // Persist state in localStorage
//     }
//   )
// );
