"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Typography, Spin, Button, Space } from "antd";
import Link from "next/link";
import { restaurantStore, menuStore, userStore } from "@/stores";
import { CategoryList } from "@/features/menu/CategoryList";
import { ProductList } from "@/features/menu/ProductList";

export default observer(function RestaurantMenuPage() {
  const params = useParams();
  const pathname = usePathname();
  // При клиентской навигации useParams() может быть пустым — берём slug из pathname
  const slugFromParams = params?.slug as string | undefined;
  const slugFromPath = pathname?.match(/^\/r\/([^/]+)/)?.[1];
  const slug = slugFromParams || slugFromPath || "";

  const [fetchDone, setFetchDone] = useState(false);
  const { current, loading: restLoading } = restaurantStore;
  const { fetchCategories, fetchAllProducts } = menuStore;

  useEffect(() => {
    if (!slug) return;
    setFetchDone(false);
    restaurantStore.fetchBySlug(slug).finally(() => setFetchDone(true));
  }, [slug]);

  useEffect(() => {
    if (current?.id) {
      menuStore.setRestaurantId(current.id);
      menuStore.setSelectedCategoryId(null);
      fetchCategories(current.id);
      fetchAllProducts(current.id);
    }
  }, [current?.id, fetchCategories, fetchAllProducts]);

  const handleSelectCategory = (id: string | null) => {
    menuStore.setSelectedCategoryId(id);
  };

  const isLoading = !slug || !fetchDone || restLoading;
  if (isLoading) {
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
        <Typography.Paragraph type="secondary">
          Ресторана с таким адресом нет в базе. Если вы только что задеплоили приложение, выполните на сервере заполнение базы:{" "}
          <code>npm run db:seed</code> (см. TEST_ACCOUNTS.md).
        </Typography.Paragraph>
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
