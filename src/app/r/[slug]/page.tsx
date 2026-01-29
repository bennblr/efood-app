"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Typography, Spin, Button, Space } from "antd";
import Link from "next/link";
import { restaurantStore, menuStore, userStore } from "@/stores";
import { CategoryList } from "@/features/menu/CategoryList";
import { ProductList } from "@/features/menu/ProductList";

export default observer(function RestaurantMenuPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { current, loading: restLoading, fetchBySlug } = restaurantStore;
  const {
    fetchCategories,
    fetchProducts,
    selectedCategoryId,
    loading: menuLoading,
    restaurantId,
  } = menuStore;

  useEffect(() => {
    if (slug) fetchBySlug(slug);
  }, [slug, fetchBySlug]);

  useEffect(() => {
    if (current?.id) {
      menuStore.setRestaurantId(current.id);
      fetchCategories(current.id);
    }
  }, [current?.id, fetchCategories]);

  useEffect(() => {
    if (restaurantId && selectedCategoryId) fetchProducts(restaurantId, selectedCategoryId);
  }, [restaurantId, selectedCategoryId, fetchProducts]);

  const handleSelectCategory = (id: string) => {
    menuStore.setSelectedCategoryId(id);
    if (current?.id) menuStore.fetchProducts(current.id, id);
  };

  if (restLoading || !slug) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!current) {
    return (
      <>
        <Typography.Title level={4}>Ресторан не найден</Typography.Title>
        <Link href="/">
          <Button>К списку ресторанов</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <Typography.Title level={4}>{current.name}</Typography.Title>
          {current.description && (
            <Typography.Paragraph type="secondary">{current.description}</Typography.Paragraph>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/r/${slug}/reservation`}>
            <Button>Бронировать</Button>
          </Link>
          <Link href="/cart">
            <Button type="primary">Корзина</Button>
          </Link>
        </div>
      </div>
      {userStore.isAuthenticated && (
        <div style={{ marginBottom: 16, padding: 12, background: "#fafafa", borderRadius: 8 }}>
          <Typography.Text type="secondary">В этом ресторане: </Typography.Text>
          <Space>
            <Link href="/my-reservations">Мои брони</Link>
            <Link href="/orders">Мои заказы</Link>
          </Space>
        </div>
      )}
      <CategoryList onSelect={handleSelectCategory} />
      <ProductList restaurantId={current.id} />
    </>
  );
});
