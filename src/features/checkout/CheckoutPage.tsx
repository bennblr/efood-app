"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Typography, Button, message } from "antd";
import Link from "next/link";
import { cartStore, orderStore } from "@/stores";

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "В заведении",
  delivery: "Доставка",
  with_reservation: "К брони",
};

export function CheckoutPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  const typeParam = searchParams.get("type");
  const orderType =
    typeParam === "delivery"
      ? "delivery"
      : reservationId
        ? "with_reservation"
        : "dine_in";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartStore.isEmpty) return;
    message.info("Корзина пуста");
  }, []);

  const submit = async () => {
    if (cartStore.isEmpty) return;
    if (!cartStore.restaurantId) {
      message.error("Ошибка: ресторан не выбран");
      return;
    }
    setLoading(true);
    try {
      await orderStore.create({
        restaurantId: cartStore.restaurantId,
        reservationId: reservationId || undefined,
        type: orderType,
        comment: cartStore.orderComment || undefined,
        items: cartStore.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      cartStore.clear();
      message.success("Заказ оформлен");
    } catch {
      message.error(orderStore.error ?? "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (cartStore.isEmpty) {
    return (
      <>
        <Typography.Title level={4}>Оформление заказа</Typography.Title>
        <Typography.Paragraph>Корзина пуста.</Typography.Paragraph>
        <Link href="/">
          <Button type="primary">К ресторанам</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Подтверждение заказа</Typography.Title>
      <Typography.Paragraph>
        Итого: {cartStore.totalSum} ₽. Позиций: {cartStore.totalCount}.
        Тип: {ORDER_TYPE_LABELS[orderType] ?? orderType}.
        {reservationId && " Заказ будет привязан к брони."}
      </Typography.Paragraph>
      <Button type="primary" loading={loading} onClick={submit}>
        Отправить заказ
      </Button>
    </>
  );
}
