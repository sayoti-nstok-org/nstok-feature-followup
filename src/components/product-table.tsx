"use client";

import React from "react";
import { Product } from "../schemas/product.schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onSelect
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">Memuat data inventory...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-muted-foreground gap-2 border rounded-xl border-dashed">
        <span className="text-sm font-medium">Tidak ada produk ditemukan.</span>
        <span className="text-xs">Coba sesuaikan kata kunci pencarian atau filter Anda.</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-24">SKU</TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Harga</TableHead>
            <TableHead className="text-center">Stok</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right w-28">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.stock <= product.minStockAlert;

            return (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => onSelect?.(product.id)}
              >
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {product.sku}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{product.name}</div>
                  {product.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {product.description}
                    </div>
                  )}
                </TableCell>
                <TableCell className="capitalize text-muted-foreground text-xs">
                  {product.category}
                </TableCell>
                <TableCell className="text-right font-medium">
                  Rp {product.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1.5 font-medium">
                    <span className={isLowStock ? "text-destructive font-bold" : ""}>
                      {product.stock}
                    </span>
                    {isLowStock && (
                      <span title={`Stok di bawah batas alert (${product.minStockAlert})`}>
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      product.status === "active"
                        ? "default"
                        : product.status === "draft"
                          ? "secondary"
                          : "outline"
                    }
                    className="capitalize text-[11px]"
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(product)}
                      title="Edit Produk"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(product.id)}
                      title="Hapus Produk"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
