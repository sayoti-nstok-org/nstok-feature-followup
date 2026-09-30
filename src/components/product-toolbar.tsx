"use client";

import React from "react";
import { useProductStore } from "../stores/product.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, RotateCcw } from "lucide-react";
import { ProductCategory, ProductStatus } from "../schemas/product.schema";

interface ProductToolbarProps {
  totalCount?: number;
}

export function ProductToolbar({ totalCount = 0 }: ProductToolbarProps) {
  const { filter, setFilter, resetFilter, openCreateModal } = useProductStore();

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border border-border shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-64 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari SKU atau nama produk..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="pl-8"
            />
          </div>

          <Button
            variant={filter.lowStockOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => setFilter({ lowStockOnly: !filter.lowStockOnly })}
            className="text-xs"
          >
            {filter.lowStockOnly ? "⚠️ Stok Rendah Saja" : "Filter Stok Rendah"}
          </Button>

          <Button variant="ghost" size="sm" onClick={resetFilter} title="Reset Filter">
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-2.5 py-1 text-xs font-normal">
            Total Produk: <span className="font-semibold ml-1">{totalCount}</span>
          </Badge>
          <Button onClick={openCreateModal} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Produk
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <Filter className="h-3 w-3" /> Kategori:
        </span>
        {(["all", "electronics", "apparel", "groceries", "stationery", "other"] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter({ category: cat as ProductCategory | "all" })}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                (filter.category || "all") === cat
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          )
        )}

        <div className="h-4 w-px bg-border mx-2" />

        <span className="text-muted-foreground">Status:</span>
        {(["all", "active", "draft", "archived"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter({ status: st as ProductStatus | "all" })}
            className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
              (filter.status || "all") === st
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {st}
          </button>
        ))}
      </div>
    </div>
  );
}
