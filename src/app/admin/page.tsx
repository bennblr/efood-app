"use client";

import { Typography } from "antd";

export default function AdminHome() {
  return (
    <>
      <Typography.Title level={4}>Админ-панель</Typography.Title>
      <Typography.Paragraph>
        Выберите раздел в меню: категории и блюда, брони, заказы, расписание, история действий.
      </Typography.Paragraph>
    </>
  );
}
