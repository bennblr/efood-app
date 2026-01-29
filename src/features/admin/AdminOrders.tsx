"use client";

import { useEffect } from "react";
import { Table, Select, message } from "antd";
import { adminStore } from "@/stores";
import type { OrderStatus } from "@/types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "confirmed", label: "Подтверждён" },
  { value: "in_progress", label: "Готовится" },
  { value: "ready", label: "Готов" },
  { value: "completed", label: "Выполнен" },
  { value: "cancelled", label: "Отменён" },
];

export function AdminOrders() {
  useEffect(() => {
    adminStore.fetchOrders();
  }, []);

  const changeStatus = async (id: string, status: OrderStatus) => {
    try {
      await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      message.success("Статус обновлён");
      adminStore.fetchOrders();
    } catch (e) {
      const err = e as { message?: string };
      message.error(err?.message ?? "Ошибка");
    }
  };

  return (
    <Table
      loading={adminStore.loading}
      dataSource={adminStore.orders}
      rowKey="id"
      columns={[
        {
          title: "Заказ",
          key: "id",
          render: (_, r) => `#${r.id.slice(-6)}`,
        },
        { title: "Сумма", dataIndex: "totalAmount", render: (v: number) => `${v} ₽` },
        { title: "Статус", dataIndex: "status" },
        {
          title: "Пользователь",
          key: "user",
          render: (_, r) => (r as { user?: { name?: string } }).user?.name ?? "—",
        },
        {
          title: "Изменить статус",
          key: "actions",
          render: (_, r) => (
            <Select
              value={r.status}
              options={STATUS_OPTIONS}
              onChange={(v) => changeStatus(r.id, v)}
              style={{ width: 140 }}
            />
          ),
        },
      ]}
    />
  );
}
