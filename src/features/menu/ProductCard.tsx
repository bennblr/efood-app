"use client";

import { Card, Button, Image, InputNumber, Space } from "antd";
import { observer } from "mobx-react-lite";
import type { Product } from "@/types";
import { cartStore } from "@/stores";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  restaurantId?: string;
  restaurantSlug?: string;
}

export const ProductCard = observer(function ProductCard({
  product,
  restaurantId,
  restaurantSlug,
}: ProductCardProps) {
  const cartItem = cartStore.items.find((i) => i.productId === product.id);
  const inCart = cartItem != null && cartItem.quantity > 0;

  const addOne = () =>
    cartStore.addItem(product, 1, undefined, restaurantId, restaurantSlug);
  const setQty = (v: number | null) => {
    if (v != null) cartStore.setQuantity(product.id, v);
  };

  return (
    <Card
      className={styles.card}
      cover={
        product.imageUrl ? (
          <Image
            alt={product.title}
            src={product.imageUrl}
            height={140}
            style={{ objectFit: "cover" }}
          />
        ) : null
      }
      actions={[
        inCart ? (
          <Space key="incart" style={{ width: "100%", justifyContent: "center" }}>
            <span style={{ color: "var(--ant-color-primary)" }}>В корзине</span>
            <InputNumber
              min={1}
              value={cartItem.quantity}
              onChange={setQty}
              size="small"
              style={{ width: 56 }}
            />
          </Space>
        ) : (
          <Button
            type="primary"
            key="add"
            onClick={addOne}
          >
            В корзину · {product.price} ₽
          </Button>
        ),
      ]}
    >
      <Card.Meta
        title={product.title}
        description={product.description ?? undefined}
      />
    </Card>
  );
});
