"use client";

import { useEffect } from "react";
import { Typography, Card, Spin } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { restaurantStore } from "@/stores";

export default observer(function Reservation() {
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
      <Typography.Title level={4}>Бронирование столика</Typography.Title>
      <Typography.Paragraph type="secondary">
        Выберите ресторан для бронирования.
      </Typography.Paragraph>
      {list.map((r) => (
        <Card key={r.id} style={{ marginBottom: 16 }}>
          <Typography.Title level={5}>{r.name}</Typography.Title>
          {r.description && (
            <Typography.Paragraph type="secondary">{r.description}</Typography.Paragraph>
          )}
          <Link href={`/r/${r.slug}/reservation`}>
            <Typography.Link>Забронировать в этом ресторане →</Typography.Link>
          </Link>
        </Card>
      ))}
      {list.length === 0 && (
        <Typography.Paragraph>Пока нет ресторанов.</Typography.Paragraph>
      )}
    </>
  );
});
