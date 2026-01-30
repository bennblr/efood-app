"use client";

import { useState } from "react";
import { Form, InputNumber, DatePicker, Button, message } from "antd";
import type { Dayjs } from "dayjs";
import { reservationStore, cartStore, orderStore } from "@/stores";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

interface ReservationFormProps {
  restaurantId: string;
  restaurantSlug?: string;
  /** Минимальная сумма предзаказа ресторана; если передан и сумма корзины меньше — кнопка предзаказа недоступна */
  minOrderAmount?: number | null;
  /** Текущая сумма корзины */
  cartTotal?: number;
  /** Есть ли предзаказ (корзина этого ресторана не пуста) */
  hasPreorder?: boolean;
}

export function ReservationForm({
  restaurantId,
  restaurantSlug,
  minOrderAmount,
  cartTotal = 0,
  hasPreorder: hasPreorderProp,
}: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hasPreorder =
    hasPreorderProp ?? (cartStore.restaurantId === restaurantId && !cartStore.isEmpty);
  const belowMinOrder =
    hasPreorder &&
    minOrderAmount != null &&
    minOrderAmount > 0 &&
    cartTotal < minOrderAmount;
  const canSubmitWithPreorder = hasPreorder && !belowMinOrder;

  const onFinish = async (v: {
    range: [Dayjs, Dayjs] | null;
    persons: number;
  }) => {
    if (!v.range || !v.range[0] || !v.range[1]) return;
    setLoading(true);
    try {
      const res = await reservationStore.create({
        restaurantId,
        startTime: v.range[0].toISOString(),
        endTime: v.range[1].toISOString(),
        personsCount: v.persons,
      });
      if (hasPreorder && canSubmitWithPreorder) {
        await orderStore.create({
          restaurantId,
          reservationId: res.id,
          type: "with_reservation",
          comment: cartStore.orderComment || undefined,
          items: cartStore.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        });
        cartStore.clear();
        message.success("Бронь и предзаказ оформлены");
        router.push("/my-reservations");
      } else {
        message.success("Бронь создана");
        router.push(`/checkout?reservationId=${res.id}`);
      }
    } catch {
      message.error(reservationStore.error ?? orderStore.error ?? "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ persons: 2 }}
    >
      <Form.Item
        name="range"
        label="Дата и время"
        rules={[{ required: true, message: "Выберите время" }]}
      >
        <RangePicker showTime format="DD.MM.YYYY HH:mm" />
      </Form.Item>
      <Form.Item
        name="persons"
        label="Количество персон"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={20} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {hasPreorder && !belowMinOrder
            ? "Забронировать и оформить предзаказ"
            : "Забронировать и перейти к заказу"}
        </Button>
      </Form.Item>
    </Form>
  );
}
