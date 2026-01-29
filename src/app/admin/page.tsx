"use client";

import { useEffect } from "react";
import { Typography, Card, Row, Col } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { userStore, adminStore } from "@/stores";

export default observer(function AdminHome() {
  const user = userStore.user;
  const isPlatformAdmin = user?.role === "admin" && !user?.restaurantId;
  const { restaurants, fetchRestaurants } = adminStore;

  useEffect(() => {
    if (isPlatformAdmin) fetchRestaurants();
  }, [isPlatformAdmin, fetchRestaurants]);

  if (!isPlatformAdmin) {
    return (
      <>
        <Typography.Title level={4}>Админ-панель</Typography.Title>
        <Typography.Paragraph>Выберите раздел в меню.</Typography.Paragraph>
      </>
    );
  }

  return (
    <>
      <Typography.Title level={4}>Управление ресторанами</Typography.Title>
      <Typography.Paragraph type="secondary">
        Выберите ресторан для управления меню, бронями и заказами. Либо добавьте новый в разделе Рестораны.
      </Typography.Paragraph>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {restaurants.map((r) => (
          <Col xs={24} sm={12} md={8} key={r.id}>
            <Link href={`/admin/r/${r.id}`}>
              <Card hoverable>
                <Card.Meta
                  title={r.name}
                  description={r.description ?? "Управление рестораном"}
                />
                <Typography.Link style={{ marginTop: 8, display: "block" }}>
                  Управление →
                </Typography.Link>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      {restaurants.length === 0 && (
        <Typography.Paragraph>Нет ресторанов. Добавьте в разделе Рестораны.</Typography.Paragraph>
      )}
    </>
  );
});
