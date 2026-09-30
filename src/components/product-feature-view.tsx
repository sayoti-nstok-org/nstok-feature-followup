"use client";

import React from "react";
import { useProductStore } from "../stores/product.store";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct
} from "../hooks/use-products";
import { ProductToolbar } from "./product-toolbar";
import { ProductTable } from "./product-table";
import { ProductForm } from "./product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { CreateProductInput } from "../schemas/product.schema";

export function ProductFeatureView() {
  const {
    filter,
    setFilter,
    isCreateModalOpen,
    closeCreateModal,
    isEditModalOpen,
    closeEditModal,
    editingProduct,
    openEditModal
  } = useProductStore();

  const { data, isLoading } = useProducts(filter);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreate = async (input: CreateProductInput) => {
    try {
      await createMutation.mutateAsync(input);
      closeCreateModal();
    } catch (err: any) {
      alert(`Gagal membuat produk: ${err.message}`);
    }
  };

  const handleUpdate = async (input: CreateProductInput) => {
    if (!editingProduct) return;
    try {
      await updateMutation.mutateAsync({ id: editingProduct.id, input });
      closeEditModal();
    } catch (err: any) {
      alert(`Gagal mengupdate produk: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(`Gagal menghapus: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <ProductToolbar totalCount={data?.total || 0} />

      <ProductTable
        products={data?.data || []}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <span>
            Halaman {data.page} dari {data.totalPages} (Total {data.total} item)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter({ page: Math.max(1, data.page - 1) })}
              disabled={data.page <= 1}
              className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 text-xs font-medium"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setFilter({ page: Math.min(data.totalPages, data.page + 1) })}
              disabled={data.page >= data.totalPages}
              className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 text-xs font-medium"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
            <DialogDescription>
              Isi data detail inventaris produk di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={closeCreateModal}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Edit */}
      <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Perbarui rincian produk {editingProduct?.sku}.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialValues={editingProduct}
              onSubmit={handleUpdate}
              onCancel={closeEditModal}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
