"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Card, Typography, Spin, Row, Col } from "antd";
import Link from "next/link";
import { restaurantStore } from "@/stores";

export const RestaurantListPage = observer(function RestaurantListPage() {
  const { list, loading, fetchList } = restaurantStore;

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Рестораны</Typography.Title>
      <Typography.Paragraph type="secondary">
        Выберите ресторан, чтобы посмотреть меню и оформить заказ.
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        {list.map((r) => (
          <Col xs={24} sm={12} md={8} key={r.id}>
            <Link href={`/r/${r.slug}`}>
              <Card
                hoverable
                cover={
                  r.imageUrl ? (
                    <div
                      style={{
                        height: 160,
                        background: `url(${r.imageUrl}) center/cover`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 160,
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography.Text type="secondary">Нет фото</Typography.Text>
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={r.name}
                  description={r.description ?? "Меню и бронирование"}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      {list.length === 0 && (
        <Typography.Paragraph>Пока нет ресторанов.</Typography.Paragraph>
      )}
    </>
  );
});
