"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Typography, Spin, Button } from "antd";
import Link from "next/link";
import { restaurantStore } from "@/stores";
import { ReservationForm } from "@/features/reservation/ReservationForm";

export default observer(function RestaurantReservationPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { current, loading, fetchBySlug } = restaurantStore;

  useEffect(() => {
    if (slug) fetchBySlug(slug);
  }, [slug, fetchBySlug]);

  if (loading || !slug) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!current) {
    return (
      <>
        <Typography.Title level={4}>Ресторан не найден</Typography.Title>
        <Link href="/">
          <Button>К списку ресторанов</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Бронирование: {current.name}</Typography.Title>
      <ReservationForm restaurantId={current.id} />
    </>
  );
});
