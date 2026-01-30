"use client";

import { observer } from "mobx-react-lite";
import { Typography, Button, Empty } from "antd";
import Link from "next/link";
import { cartStore } from "@/stores";
import { CartItemRow } from "./CartItemRow";

export const CartPage = observer(function CartPage() {
  const { items, totalSum, isEmpty, restaurantSlug } = cartStore;

  if (isEmpty) {
    return (
      <>
        <Typography.Title level={4}>Корзина</Typography.Title>
        <Empty description="Корзина пуста">
          <Link href="/">
            <Button type="primary">В меню</Button>
          </Link>
        </Empty>
      </>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Корзина</Typography.Title>
      {items.map((item) => (
        <CartItemRow key={item.productId} item={item} />
      ))}
      <Typography.Text strong>Итого: {totalSum} ₽</Typography.Text>
      <div style={{ marginTop: 16 }}>
        <Typography.Text type="secondary">Комментарий к заказу</Typography.Text>
        <textarea
          placeholder="Пожелания к заказу или бронированию"
          value={cartStore.orderComment}
          onChange={(e) => cartStore.setOrderComment(e.target.value)}
          rows={3}
          style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 6, border: "1px solid #d9d9d9" }}
        />
      </div>
      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {restaurantSlug && (
          <Link href={`/r/${restaurantSlug}/reservation`}>
            <Button type="primary">Бронь + заказ</Button>
          </Link>
        )}
        <Link href="/checkout">
          <Button>Только заказ</Button>
        </Link>
        <Link href="/checkout?type=delivery">
          <Button>Доставка</Button>
        </Link>
      </div>
    </>
  );
});
