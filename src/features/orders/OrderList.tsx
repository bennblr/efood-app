"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { List, Typography, Spin, Tag } from "antd";
import { orderStore } from "@/stores";
import type { OrderStatus } from "@/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  in_progress: "Готовится",
  ready: "Готов",
  completed: "Выполнен",
  cancelled: "Отменён",
};

export const OrderList = observer(function OrderList() {
  const { list, loading, fetchMyOrders } = orderStore;

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (loading) return <Spin size="large" />;

  return (
    <List
      itemLayout="vertical"
      dataSource={list}
      renderItem={(order) => (
        <List.Item
          key={order.id}
          extra={
            <Tag color={order.status === "cancelled" ? "default" : "blue"}>
              {STATUS_LABEL[order.status]}
            </Tag>
          }
        >
          <List.Item.Meta
            title={`Заказ #${order.id.slice(-6)} · ${order.totalAmount} ₽`}
            description={
              <>
                <Typography.Text type="secondary">
                  {new Date(order.createdAt).toLocaleString("ru")}
                </Typography.Text>
                {order.items?.length ? (
                  <div style={{ marginTop: 4 }}>
                    {order.items.map((i) => (
                      <span key={i.id}>
                        {i.product?.title ?? "—"} × {i.quantity}{" "}
                      </span>
                    ))}
                  </div>
                ) : null}
              </>
            }
          />
        </List.Item>
      )}
    />
  );
});
