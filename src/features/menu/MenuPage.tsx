"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Typography, Spin } from "antd";
import { menuStore } from "@/stores";
import { CategoryList } from "./CategoryList";
import { ProductList } from "./ProductList";

interface MenuPageProps {
  restaurantId: string;
}

/** Страница меню для выбранного ресторана. Используется при необходимости; основная точка входа — /r/[slug]. */
export const MenuPage = observer(function MenuPage({ restaurantId }: MenuPageProps) {
  const { fetchCategories, fetchProducts, selectedCategoryId, loading } =
    menuStore;

  useEffect(() => {
    fetchCategories(restaurantId);
  }, [restaurantId, fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId) fetchProducts(restaurantId, selectedCategoryId);
  }, [restaurantId, selectedCategoryId, fetchProducts]);

  const handleSelectCategory = (id: string) => {
    menuStore.setSelectedCategoryId(id);
    menuStore.fetchProducts(restaurantId, id);
  };

  return (
    <>
      <Typography.Title level={4}>Меню</Typography.Title>
      <CategoryList onSelect={handleSelectCategory} />
      <ProductList restaurantId={restaurantId} />
    </>
  );
});
