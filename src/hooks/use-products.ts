import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApiService } from "../services/product.service";
import { ProductFilter, CreateProductInput, UpdateProductInput } from "../schemas/product.schema";

export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, "list"] as const,
  list: (filter: ProductFilter) => [...PRODUCT_QUERY_KEYS.lists(), filter] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const
};

export function useProducts(filter: ProductFilter) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filter),
    queryFn: () => productApiService.getProducts(filter),
    staleTime: 1000 * 60 * 2 // 2 menit
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id || ""),
    queryFn: () => (id ? productApiService.getProductById(id) : null),
    enabled: Boolean(id)
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productApiService.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      productApiService.updateProduct(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.id) });
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApiService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
    }
  });
}
