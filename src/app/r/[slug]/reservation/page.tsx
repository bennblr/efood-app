"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Typography, Spin, Button } from "antd";
import Link from "next/link";
import { restaurantStore } from "@/stores";
import { ReservationForm } from "@/features/reservation/ReservationForm";

export default observer(function RestaurantReservationPage() {
  const params = useParams();
  const pathname = usePathname();
  const slugFromParams = params?.slug as string | undefined;
  const slugFromPath = pathname?.match(/^\/r\/([^/]+)/)?.[1];
  const slug = slugFromParams || slugFromPath || "";

  const { current, loading } = restaurantStore;

  useEffect(() => {
    if (slug) restaurantStore.fetchBySlug(slug);
  }, [slug]);

  if (!slug || loading) {
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
