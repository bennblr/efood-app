"use client";

import { useEffect } from "react";
import { Table, Select, message } from "antd";
import { adminStore } from "@/stores";
import { apiFetch } from "@/lib/api";
import type { ReservationStatus } from "@/types";

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "confirmed", label: "Подтверждена" },
  { value: "cancelled", label: "Отменена" },
  { value: "completed", label: "Завершена" },
];

export function AdminReservations() {
  useEffect(() => {
    adminStore.fetchReservations();
  }, []);

  const changeStatus = async (id: string, status: ReservationStatus) => {
    try {
      await apiFetch(`/api/admin/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      message.success("Статус обновлён");
      adminStore.fetchReservations();
    } catch {
      // Ошибка уже показана через apiFetch
    }
  };

  return (
    <Table
      loading={adminStore.loading}
      dataSource={adminStore.reservations}
      rowKey="id"
      columns={[
        {
          title: "Время",
          key: "time",
          render: (_, r) =>
            `${new Date(r.startTime).toLocaleString("ru")} — ${new Date(r.endTime).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}`,
        },
        { title: "Персон", dataIndex: "personsCount" },
        { title: "Статус", dataIndex: "status" },
        {
          title: "Пользователь",
          key: "user",
          render: (_, r) => (r as { user?: { name?: string; username?: string } }).user?.name ?? (r as { user?: { username?: string } }).user?.username ?? "—",
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
