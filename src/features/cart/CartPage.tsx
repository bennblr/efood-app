"use client";

import { observer } from "mobx-react-lite";
import { Typography, Button, Empty } from "antd";
import Link from "next/link";
import { cartStore } from "@/stores";
import { CartItemRow } from "./CartItemRow";

export const CartPage = observer(function CartPage() {
  const { items, totalSum, isEmpty } = cartStore;

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
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Link href="/reservation">
          <Button type="primary">Бронь + заказ</Button>
        </Link>
        <Link href="/checkout">
          <Button>Только заказ</Button>
        </Link>
      </div>
    </>
  );
});
