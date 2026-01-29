"use client";

import { Typography, Empty } from "antd";
import { OrderList } from "./OrderList";
import { orderStore } from "@/stores";
import { observer } from "mobx-react-lite";

export const OrdersPage = observer(function OrdersPage() {
  const { list } = orderStore;

  return (
    <>
      <Typography.Title level={4}>Мои заказы</Typography.Title>
      {list.length === 0 && !orderStore.loading ? (
        <Empty description="Заказов пока нет" />
      ) : (
        <OrderList />
      )}
    </>
  );
});
