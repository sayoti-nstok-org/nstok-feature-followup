import { create } from "zustand";
import { Product, ProductFilter } from "../schemas/product.schema";

interface ProductFeatureState {
  filter: ProductFilter;
  selectedProductId: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingProduct: Product | null;

  // Actions
  setFilter: (filter: Partial<ProductFilter>) => void;
  resetFilter: () => void;
  setSelectedProductId: (id: string | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (product: Product) => void;
  closeEditModal: () => void;
}

const initialFilter: ProductFilter = {
  search: "",
  category: "all",
  status: "all",
  lowStockOnly: false,
  page: 1,
  limit: 10
};

export const useProductStore = create<ProductFeatureState>((set) => ({
  filter: initialFilter,
  selectedProductId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  editingProduct: null,

  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter, page: newFilter.page ?? 1 }
    })),

  resetFilter: () => set({ filter: initialFilter }),

  setSelectedProductId: (id) => set({ selectedProductId: id }),

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  openEditModal: (product) => set({ isEditModalOpen: true, editingProduct: product }),
  closeEditModal: () => set({ isEditModalOpen: false, editingProduct: null })
}));
