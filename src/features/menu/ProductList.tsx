"use client";

import { observer } from "mobx-react-lite";
import { Row, Col, Spin, Empty, Typography } from "antd";
import { menuStore } from "@/stores";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductListProps {
  restaurantId?: string;
  restaurantSlug?: string;
}

function groupByCategory(products: Product[]): { categoryId: string; categoryTitle: string; products: Product[] }[] {
  const order: string[] = [];
  const map = new Map<string, { categoryTitle: string; products: Product[] }>();
  for (const p of products) {
    const catId = p.categoryId;
    const title = p.category?.title ?? "";
    if (!map.has(catId)) {
      order.push(catId);
      map.set(catId, { categoryTitle: title, products: [] });
    }
    map.get(catId)!.products.push(p);
  }
  return order.map((categoryId) => ({
    categoryId,
    categoryTitle: map.get(categoryId)!.categoryTitle,
    products: map.get(categoryId)!.products,
  }));
}

export const ProductList = observer(function ProductList({ restaurantId, restaurantSlug }: ProductListProps) {
  const { products, loading, selectedCategoryId, allProductsInOrder } = menuStore;

  if (loading) return <Spin size="large" />;
  if (!products.length) return <Empty description="Нет блюд в меню" />;

  if (selectedCategoryId) {
    return (
      <Row gutter={[16, 16]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} key={p.id}>
            <ProductCard product={p} restaurantId={restaurantId} restaurantSlug={restaurantSlug} />
          </Col>
        ))}
      </Row>
    );
  }

  const groups = groupByCategory(allProductsInOrder);
  return (
    <>
      {groups.map(({ categoryId, categoryTitle, products: groupProducts }) => (
        <div key={categoryId} style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ marginBottom: 12 }}>
            {categoryTitle || "Без категории"}
          </Typography.Title>
          <Row gutter={[16, 16]}>
            {groupProducts.map((p) => (
              <Col xs={24} sm={12} md={8} key={p.id}>
                <ProductCard product={p} restaurantId={restaurantId} restaurantSlug={restaurantSlug} />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
});
