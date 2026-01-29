"use client";

import { Typography } from "antd";
import { ReservationForm } from "@/features/reservation/ReservationForm";

export default function Reservation() {
  return (
    <>
      <Typography.Title level={4}>Бронирование столика</Typography.Title>
      <ReservationForm />
    </>
  );
}
