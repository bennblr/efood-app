"use client";

import { useEffect } from "react";
import { Typography, Empty, Spin } from "antd";
import { MyReservationsList } from "./MyReservationsList";
import { reservationStore } from "@/stores";
import { observer } from "mobx-react-lite";

export const MyReservationsPage = observer(function MyReservationsPage() {
  const { list, loading, fetchMyReservations } = reservationStore;

  useEffect(() => {
    reservationStore.fetchMyReservations();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Мои брони</Typography.Title>
      {list.length === 0 && !reservationStore.loading ? (
        <Empty description="Броней пока нет" />
      ) : (
        <MyReservationsList />
      )}
    </>
  );
});
