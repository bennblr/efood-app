"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Menu, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { userStore, adminStore } from "@/stores";
import { ReactNode } from "react";

const RESTAURANT_ITEMS = [
  { key: "/admin/restaurants", label: "Рестораны" },
];

const RESTAURANT_SECTION_ITEMS = (base: string) => [
  { key: base, label: "Обзор" },
  { key: `${base}/categories`, label: "Категории" },
  { key: `${base}/products`, label: "Блюда" },
  { key: `${base}/reservations`, label: "Брони" },
  { key: `${base}/orders`, label: "Заказы" },
  { key: `${base}/schedules`, label: "Расписание" },
  { key: `${base}/audit`, label: "История действий" },
];

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = userStore.user;
  const isPlatformAdmin = user?.role === "admin" && !user?.restaurantId;
  const matchRestaurantPath = pathname?.match(/^\/admin\/r\/([^/]+)/);
  const restaurantIdFromPath = matchRestaurantPath?.[1];
  const baseRestaurantPath = restaurantIdFromPath ? `/admin/r/${restaurantIdFromPath}` : null;

  // Редирект админа ресторана: при входе в /admin или /admin/categories и т.д. — сразу на страницу своего ресторана
  useEffect(() => {
    if (userStore.loading || !user?.restaurantId || !pathname) return;
    if (!pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/admin/r/")) {
      const idInPath = pathname.match(/^\/admin\/r\/([^/]+)/)?.[1];
      if (idInPath && idInPath !== user.restaurantId) {
        const rest = pathname.slice(`/admin/r/${idInPath}`.length) || "";
        router.replace(`/admin/r/${user.restaurantId}${rest}`);
      }
      return;
    }
    const rest = pathname === "/admin" || pathname === "/admin/restaurants" ? "" : pathname.slice(6);
    router.replace(`/admin/r/${user.restaurantId}${rest}`);
  }, [user?.restaurantId, pathname, router]);

  // Суперадмин: со старых URL (/admin/categories и т.д.) — на главную, выбор ресторана
  useEffect(() => {
    if (userStore.loading || !pathname || !isPlatformAdmin) return;
    if (pathname === "/admin" || pathname === "/admin/restaurants" || pathname.startsWith("/admin/r/")) return;
    if (pathname.startsWith("/admin/")) router.replace("/admin");
  }, [pathname, isPlatformAdmin, router]);

  useEffect(() => {
    if (userStore.loading) return;
    if (!userStore.isAdmin && userStore.user !== undefined) {
      router.replace("/");
    }
  }, [userStore.loading, userStore.isAdmin, userStore.user, router]);

  // Из URL /admin/r/[id] подставляем ресторан в стор
  useEffect(() => {
    if (restaurantIdFromPath) adminStore.setCurrentRestaurantId(restaurantIdFromPath);
  }, [restaurantIdFromPath]);

  useEffect(() => {
    if (userStore.isAdmin) adminStore.fetchRestaurants();
  }, [userStore.isAdmin]);

  if (!userStore.loading && !userStore.isAdmin) {
    return null;
  }

  const isOnRestaurantPage = Boolean(baseRestaurantPath);
  const menuItems = isOnRestaurantPage
    ? RESTAURANT_SECTION_ITEMS(baseRestaurantPath!)
    : isPlatformAdmin
      ? [...RESTAURANT_ITEMS, { key: "/admin", label: "Главная" }]
      : [];

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ minWidth: 180 }}>
        <Typography.Title level={5}>Админка</Typography.Title>
        {isOnRestaurantPage && adminStore.restaurants.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>Ресторан</Typography.Text>
            <div style={{ marginTop: 4, fontWeight: 500 }}>
              {adminStore.restaurants.find((r) => r.id === restaurantIdFromPath)?.name ?? restaurantIdFromPath}
            </div>
          </div>
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
