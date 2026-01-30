"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, Select, message } from "antd";
import { observer } from "mobx-react-lite";
import { adminStore } from "@/stores";
import { apiFetch } from "@/lib/api";
import type { OrderStatus, OrderType } from "@/types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "confirmed", label: "Подтверждён" },
  { value: "in_progress", label: "Готовится" },
  { value: "ready", label: "Готов" },
  { value: "completed", label: "Выполнен" },
  { value: "cancelled", label: "Отменён" },
];

const TYPE_OPTIONS: { value: OrderType | "all"; label: string }[] = [
  { value: "all", label: "Все типы" },
  { value: "dine_in", label: "В заведении" },
  { value: "delivery", label: "Доставка" },
  { value: "with_reservation", label: "К брони" },
];

const TYPE_LABELS: Record<string, string> = {
  dine_in: "В заведении",
  delivery: "Доставка",
  with_reservation: "К брони",
};

export const AdminOrders = observer(function AdminOrders() {
  const [typeFilter, setTypeFilter] = useState<OrderType | "all">("all");

  useEffect(() => {
    adminStore.fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const list = adminStore.orders;
    if (typeFilter === "all") return list;
    return list.filter((o) => (o as { type?: OrderType }).type === typeFilter);
  }, [adminStore.orders, typeFilter]);

  const changeStatus = async (id: string, status: OrderStatus) => {
    try {
      await apiFetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      message.success("Статус обновлён");
      adminStore.fetchOrders();
    } catch {
      // Ошибка уже показана через apiFetch
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Тип заказа:</span>
        <Select
          value={typeFilter}
          options={TYPE_OPTIONS}
          onChange={setTypeFilter}
          style={{ width: 180 }}
        />
      </div>
      <Table
        loading={adminStore.loading}
        dataSource={filteredOrders}
        rowKey="id"
        columns={[
          {
            title: "Заказ",
            key: "id",
            render: (_, r) => `#${r.id.slice(-6)}`,
          },
          { title: "Сумма", dataIndex: "totalAmount", render: (v: number) => `${v} ₽` },
          {
            title: "Тип",
            key: "type",
            render: (_, r) => TYPE_LABELS[(r as { type?: string }).type ?? ""] ?? (r as { type?: string }).type ?? "—",
          },
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
    </>
  );
});
