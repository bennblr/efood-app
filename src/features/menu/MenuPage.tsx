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
  const { fetchCategories, fetchAllProducts } = menuStore;

  useEffect(() => {
    menuStore.setRestaurantId(restaurantId);
    menuStore.setSelectedCategoryId(null);
    fetchCategories(restaurantId);
    fetchAllProducts(restaurantId);
  }, [restaurantId, fetchCategories, fetchAllProducts]);

  const handleSelectCategory = (id: string | null) => {
    menuStore.setSelectedCategoryId(id);
  };

  return (
    <>
      <Typography.Title level={4}>Меню</Typography.Title>
      <CategoryList onSelect={handleSelectCategory} />
      <ProductList restaurantId={restaurantId} />
    </>
  );
});
