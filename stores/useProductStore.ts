import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category } from "@/components/ProductAddingForm/ProductAddinFormZodSchema";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  sku: string;
  image: string;
  minStock: number;
  lastUpdated: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (token: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id" | "lastUpdated">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getLowStockProducts: () => Product[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string ) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      selectedProductId: null,

      fetchProducts: async (token: String) => {
        set({ loading: true, error: null });
        console.log(token);

        try {
          // In a real app, you would fetch from an API here
          // const response = await fetch('/api/products');
          // const data = await response.json();
          // set({ products: data, loading: false });

          // For demo purposes, we'll just set some mock data

          const response = await fetch("/api/protect/product", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          set({
            products: data.getproduct,
            loading: false,
          });
        } catch (err) {
          set({ error: "Failed to fetch products", loading: false });
        }
      },

      getProductById: (id) => {
        return get().products.find((product) => product.id === id);
      },

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Math.random().toString(36).substring(2, 9),
          lastUpdated: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updates,
                  lastUpdated: new Date().toISOString(),
                }
              : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      getLowStockProducts: () => {
        return get().products.filter(
          (product) => product.stock <= product.minStock
        );
      },
      setSelectedProductId: (id:string) => {
        set({ selectedProductId: id });
      },

    }),
    {
      name: "product-storage", // name for the localStorage key
      // You can customize which parts of state to persist:
      // partialize: (state) => ({ products: state.products }),
    }
  )
);
