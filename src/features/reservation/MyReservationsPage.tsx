"use client";

import { Typography, Empty } from "antd";
import { MyReservationsList } from "./MyReservationsList";
import { reservationStore } from "@/stores";
import { observer } from "mobx-react-lite";

export const MyReservationsPage = observer(function MyReservationsPage() {
  const { list } = reservationStore;

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
