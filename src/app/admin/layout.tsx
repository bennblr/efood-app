"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Menu, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { userStore } from "@/stores";
import { ReactNode } from "react";

const ITEMS = [
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

  useEffect(() => {
    if (userStore.loading) return;
    if (!userStore.isAdmin && userStore.user !== undefined) {
      router.replace("/");
    }
  }, [userStore.loading, userStore.isAdmin, userStore.user, router]);

  if (!userStore.loading && !userStore.isAdmin) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ minWidth: 180 }}>
        <Typography.Title level={5}>Админка</Typography.Title>
        <Menu
          mode="inline"
          selectedKeys={[pathname ?? "/admin"]}
          items={ITEMS}
          onClick={({ key }) => router.push(key)}
        />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default observer(AdminLayoutInner);
