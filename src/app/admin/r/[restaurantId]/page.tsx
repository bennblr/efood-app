"use client";

import { Typography } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { adminStore } from "@/stores";

export default observer(function AdminRestaurantOverview() {
  const params = useParams();
  const restaurantId = params?.restaurantId as string | undefined;
  const restaurant = adminStore.restaurants.find((r) => r.id === restaurantId);

  return (
    <>
      <Typography.Title level={4}>{restaurant?.name ?? "Ресторан"}</Typography.Title>
      <Typography.Paragraph type="secondary">
        Управление меню, бронями и заказами. Выберите раздел в меню слева.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Link href={`/admin/r/${restaurantId}/categories`}>Категории и блюда</Link>
        {" · "}
        <Link href={`/admin/r/${restaurantId}/reservations`}>Брони</Link>
        {" · "}
        <Link href={`/admin/r/${restaurantId}/orders`}>Заказы</Link>
        {" · "}
        <Link href={`/admin/r/${restaurantId}/schedules`}>Расписание</Link>
        {" · "}
        <Link href={`/admin/r/${restaurantId}/audit`}>История действий</Link>
      </Typography.Paragraph>
    </>
  );
});
