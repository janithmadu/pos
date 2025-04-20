import { z } from "zod";
export const ProductAddinFormZodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  sku: z.string().min(1, "SKU is required"),
  image: z.string().url("Invalid image URL"),
  minStock: z
    .number()
    .int()
    .nonnegative("Min stock must be a non-negative integer"),
  lastUpdated: z.string().optional(),
});

export type Product = z.infer<typeof ProductAddinFormZodSchema>;

export const CategoryAddinFormZodSchema = z.object({
  id:z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type Category = z.infer<typeof CategoryAddinFormZodSchema>;
