import { Product, ProductFilter, CreateProductInput, UpdateProductInput } from "../schemas/product.schema";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export class ProductApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `API request error: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as ApiEnvelope<T>;
    return json.data;
  }

  async getProducts(filter?: ProductFilter): Promise<PaginatedResult<Product>> {
    const params = new URLSearchParams();
    if (filter?.search) params.set("search", filter.search);
    if (filter?.category && filter.category !== "all") params.set("category", filter.category);
    if (filter?.status && filter.status !== "all") params.set("status", filter.status);
    if (filter?.lowStockOnly) params.set("lowStockOnly", "true");
    if (filter?.page) params.set("page", filter.page.toString());
    if (filter?.limit) params.set("limit", filter.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return this.request<PaginatedResult<Product>>(`/api/products${queryString}`);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return this.request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean; id: string }> {
    return this.request<{ success: boolean; id: string }>(`/api/products/${id}`, {
      method: "DELETE"
    });
  }
}

export const productApiService = new ProductApiService();
