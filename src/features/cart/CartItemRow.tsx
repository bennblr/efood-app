"use client";

import { InputNumber, Button, Input } from "antd";
import { observer } from "mobx-react-lite";
import { cartStore } from "@/stores";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = observer(function CartItemRow({ item }: CartItemRowProps) {
  const changeQty = (v: number | null) => {
    if (v != null) cartStore.setQuantity(item.productId, v);
  };
  const remove = () => cartStore.removeItem(item.productId);
  const setComment = (e: React.ChangeEvent<HTMLInputElement>) =>
    cartStore.setComment(item.productId, e.target.value);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
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
      <Input
        placeholder="Комментарий"
        value={item.comment ?? ""}
        onChange={setComment}
        style={{ width: 120 }}
      />
    </div>
  );
});
