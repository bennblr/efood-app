"use client";

import { Typography } from "antd";
import { observer } from "mobx-react-lite";
import { userStore } from "@/stores";
import { AdminRestaurants } from "@/features/admin/AdminRestaurants";

export default observer(function AdminRestaurantsPage() {
  const user = userStore.user;
  const isPlatformAdmin = user?.role === "admin" && !user?.restaurantId;

  if (!isPlatformAdmin) {
    return (
      <Typography.Paragraph type="danger">
        Управление ресторанами доступно только суперадмину платформы.
      </Typography.Paragraph>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Рестораны</Typography.Title>
      <Typography.Paragraph type="secondary">
        Добавляйте рестораны в агрегатор. Каждый ресторан управляет своим меню, бронями и заказами.
      </Typography.Paragraph>
      <AdminRestaurants />
    </>
  );
});
