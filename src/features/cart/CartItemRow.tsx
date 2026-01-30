"use client";

import { InputNumber, Button, Image } from "antd";
import { observer } from "mobx-react-lite";
import { cartStore } from "@/stores";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  /** Компактный вид без изображения (например, в блоке предзаказа на странице брони) */
  compact?: boolean;
}

export const CartItemRow = observer(function CartItemRow({ item, compact }: CartItemRowProps) {
  const changeQty = (v: number | null) => {
    if (v != null) cartStore.setQuantity(item.productId, v);
  };
  const remove = () => cartStore.removeItem(item.productId);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
      {!compact && (
        <Image
          src={item.product.imageUrl ?? undefined}
          alt={item.product.title}
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
          fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%23f0f0f0' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='10'%3ENo image%3C/text%3E%3C/svg%3E"
        />
      )}
      <span style={{ flex: 1 }}>{item.product.title}</span>
      <InputNumber
        min={1}
        value={item.quantity}
        onChange={changeQty}
        style={{ width: 70 }}
      />
      <span>{item.product.price * item.quantity} ₽</span>
      <Button size="small" danger onClick={remove}>
        Удалить
      </Button>
    </div>
  );
});
