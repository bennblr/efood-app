"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { List, Typography, Spin, Tag } from "antd";
import { reservationStore } from "@/stores";
import type { ReservationStatus } from "@/types";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  cancelled: "Отменена",
  completed: "Завершена",
};

export const MyReservationsList = observer(function MyReservationsList() {
  const { list, loading, fetchMyReservations } = reservationStore;

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  if (loading) return <Spin size="large" />;

  return (
    <List
      itemLayout="vertical"
      dataSource={list}
      renderItem={(r) => (
        <List.Item
          key={r.id}
          extra={
            <Tag color={r.status === "cancelled" ? "default" : "green"}>
              {STATUS_LABEL[r.status]}
            </Tag>
          }
        >
          <List.Item.Meta
            title={`${new Date(r.startTime).toLocaleString("ru")} — ${new Date(r.endTime).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}`}
            description={
              <Typography.Text type="secondary">
                {r.personsCount} персон · {new Date(r.createdAt).toLocaleString("ru")}
              </Typography.Text>
            }
          />
        </List.Item>
      )}
    />
  );
});
