"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Menu, Typography, Select } from "antd";
import { observer } from "mobx-react-lite";
import { userStore, adminStore } from "@/stores";
import { ReactNode } from "react";

const RESTAURANT_ITEMS = [
  { key: "/admin/restaurants", label: "Рестораны" },
];

const COMMON_ITEMS = [
  { key: "/admin", label: "Обзор" },
  { key: "/admin/categories", label: "Категории" },
  { key: "/admin/products", label: "Блюда" },
  { key: "/admin/reservations", label: "Брони" },
  { key: "/admin/orders", label: "Заказы" },
  { key: "/admin/schedules", label: "Расписание" },
  { key: "/admin/audit", label: "История действий" },
];

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = userStore.user;
  const isPlatformAdmin = user?.role === "admin" && !user?.restaurantId;
  const restaurantId = user?.restaurantId ?? adminStore.currentRestaurantId;

  useEffect(() => {
    if (userStore.loading) return;
    if (!userStore.isAdmin && userStore.user !== undefined) {
      router.replace("/");
    }
  }, [userStore.loading, userStore.isAdmin, userStore.user, router]);

  useEffect(() => {
    if (!user?.restaurantId) return;
    adminStore.setCurrentRestaurantId(user.restaurantId);
  }, [user?.restaurantId]);

  // Суперадмины: загружаем все рестораны для выбора. Владельцы/сотрудники: загружаем свой ресторан (один) для отображения названия.
  useEffect(() => {
    if (userStore.isAdmin) adminStore.fetchRestaurants();
  }, [userStore.isAdmin]);

  // Только для суперадмина: при первой загрузке автоматически выбрать первый ресторан в списке.
  useEffect(() => {
    if (isPlatformAdmin && adminStore.restaurants.length && !adminStore.currentRestaurantId) {
      adminStore.setCurrentRestaurantId(adminStore.restaurants[0]?.id ?? null);
    }
  }, [isPlatformAdmin, adminStore.restaurants.length, adminStore.currentRestaurantId]);

  if (!userStore.loading && !userStore.isAdmin) {
    return null;
  }

  const menuItems = isPlatformAdmin
    ? [...RESTAURANT_ITEMS, ...COMMON_ITEMS]
    : COMMON_ITEMS;

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ minWidth: 180 }}>
        <Typography.Title level={5}>Админка</Typography.Title>
        {isPlatformAdmin ? (
          <div style={{ marginBottom: 12 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>Ресторан для управления</Typography.Text>
            <Select
              style={{ width: "100%", marginTop: 4 }}
              placeholder="Выберите ресторан"
              value={adminStore.currentRestaurantId}
              onChange={(id) => adminStore.setCurrentRestaurantId(id)}
              options={adminStore.restaurants.map((r) => ({ label: r.name, value: r.id }))}
            />
          </div>
        ) : (
          adminStore.restaurants.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>Ваш ресторан</Typography.Text>
              <div style={{ marginTop: 4, fontWeight: 500 }}>{adminStore.restaurants[0]?.name}</div>
            </div>
          )
        )}
        <Menu
          mode="inline"
          selectedKeys={[pathname ?? "/admin"]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default observer(AdminLayoutInner);
