"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Typography, Spin, Button, Card, Alert } from "antd";
import Link from "next/link";
import { restaurantStore, cartStore } from "@/stores";
import { ReservationForm } from "@/features/reservation/ReservationForm";
import { CartItemRow } from "@/features/cart/CartItemRow";

export default observer(function RestaurantReservationPage() {
  const params = useParams();
  const pathname = usePathname();
  const slugFromParams = params?.slug as string | undefined;
  const slugFromPath = pathname?.match(/^\/r\/([^/]+)/)?.[1];
  const slug = slugFromParams || slugFromPath || "";

  const { current, loading } = restaurantStore;
  const { items, restaurantId, isEmpty, totalSum } = cartStore;
  const showPreorder = current && restaurantId === current.id && !isEmpty;
  const minOrderAmount = current?.minOrderAmount ?? null;
  const belowMinOrder =
    showPreorder && minOrderAmount != null && totalSum < minOrderAmount;

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
      {showPreorder && (
        <Card title="Ваш предзаказ" size="small" style={{ marginBottom: 24 }}>
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} compact />
          ))}
          <Typography.Text strong>Итого: {cartStore.totalSum} ₽</Typography.Text>
        </Card>
      )}
      {belowMinOrder && (
        <Alert
          type="warning"
          showIcon
          message={`Минимальная сумма предзаказа — ${minOrderAmount} ₽`}
          description="Добавьте больше товаров в корзину для бронирования с предзаказом или оформите бронь без предзаказа."
          style={{ marginBottom: 24 }}
        />
      )}
      <ReservationForm
        restaurantId={current.id}
        restaurantSlug={current.slug}
        minOrderAmount={minOrderAmount}
        cartTotal={totalSum}
        hasPreorder={showPreorder}
      />
    </>
  );
});
