"use client";

import { Card, Button, Image } from "antd";
import type { Product } from "@/types";
import { cartStore } from "@/stores";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = () => cartStore.addItem(product, 1);

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
        <Button type="primary" key="add" onClick={addToCart}>
          В корзину · {product.price} ₽
        </Button>,
      ]}
    >
      <Card.Meta
        title={product.title}
        description={product.description ?? undefined}
      />
    </Card>
  );
}
