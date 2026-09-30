import { z } from "zod";

export const ProductStatusSchema = z.enum(["draft", "active", "archived"]);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const ProductCategorySchema = z.enum([
  "electronics",
  "apparel",
  "groceries",
  "stationery",
  "other"
]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  sku: z.string().min(3, "SKU minimal 3 karakter").max(20, "SKU maksimal 20 karakter"),
  name: z.string().min(2, "Nama produk minimal 2 karakter").max(100, "Nama produk maksimal 100 karakter"),
  category: ProductCategorySchema,
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  stock: z.coerce.number().int("Stok harus integer").min(0, "Stok tidak boleh negatif"),
  minStockAlert: z.coerce.number().int().min(0).default(5),
  status: ProductStatusSchema.default("active"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional().default(""),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductInputSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;

export const UpdateProductInputSchema = CreateProductInputSchema.partial();
export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;

export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: z.union([ProductCategorySchema, z.literal("all")]).optional(),
  status: z.union([ProductStatusSchema, z.literal("all")]).optional(),
  lowStockOnly: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
});
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
