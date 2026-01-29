"use client";

import { observer } from "mobx-react-lite";
import { Row, Col, Spin, Empty } from "antd";
import { menuStore } from "@/stores";
import { ProductCard } from "./ProductCard";

export const ProductList = observer(function ProductList() {
  const { products, loading } = menuStore;

  if (loading) return <Spin size="large" />;
  if (!products.length) return <Empty description="Выберите категорию" />;

  return (
    <Row gutter={[16, 16]}>
      {products.map((p) => (
        <Col xs={24} sm={12} md={8} key={p.id}>
          <ProductCard product={p} />
        </Col>
      ))}
    </Row>
  );
});
