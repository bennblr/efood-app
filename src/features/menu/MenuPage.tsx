"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Typography, Spin } from "antd";
import { menuStore } from "@/stores";
import { CategoryList } from "./CategoryList";
import { ProductList } from "./ProductList";

export const MenuPage = observer(function MenuPage() {
  const { fetchCategories, fetchProducts, selectedCategoryId, loading } =
    menuStore;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId) fetchProducts(selectedCategoryId);
  }, [selectedCategoryId, fetchProducts]);

  const handleSelectCategory = (id: string) => {
    menuStore.setSelectedCategoryId(id);
    menuStore.fetchProducts(id);
  };

  return (
    <>
      <Typography.Title level={4}>Меню</Typography.Title>
      <CategoryList onSelect={handleSelectCategory} />
      <ProductList />
    </>
  );
});
