"use client";

import { useState } from "react";
import { Form, InputNumber, DatePicker, Button, message } from "antd";
import type { Dayjs } from "dayjs";
import { reservationStore } from "@/stores";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

interface ReservationFormProps {
  restaurantId: string;
}

export function ReservationForm({ restaurantId }: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      message.success("Бронь создана");
      router.push(`/checkout?reservationId=${res.id}`);
    } catch {
      message.error(reservationStore.error ?? "Ошибка");
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
          Забронировать и перейти к заказу
        </Button>
      </Form.Item>
    </Form>
  );
}
