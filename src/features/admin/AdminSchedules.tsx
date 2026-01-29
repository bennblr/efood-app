"use client";

import { useEffect, useState } from "react";
import { Table, Button, Form, Input, message } from "antd";
import { adminStore } from "@/stores";

const DAY_NAMES = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export function AdminSchedules() {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    adminStore.fetchSchedules();
  }, []);

  useEffect(() => {
    if (!editing) return;
    const byDay: Record<number, { openTime: string; closeTime: string }> = {};
    adminStore.schedules.forEach((s) => {
      byDay[s.dayOfWeek] = { openTime: s.openTime, closeTime: s.closeTime };
    });
    form.setFieldsValue(
      Object.fromEntries(
        [0, 1, 2, 3, 4, 5, 6].map((d) => [
          `day_${d}`,
          byDay[d] ?? { openTime: "09:00", closeTime: "22:00" },
        ])
      )
    );
  }, [adminStore.schedules, editing, form]);

  const handleSave = async () => {
    const values = form.getFieldsValue();
    const list = [0, 1, 2, 3, 4, 5, 6].map((d) => {
      const v = values[`day_${d}`] ?? { openTime: "09:00", closeTime: "22:00" };
      return { dayOfWeek: d, openTime: v.openTime, closeTime: v.closeTime };
    });
    try {
      await fetch("/api/admin/schedules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      message.success("Расписание сохранено");
      setEditing(false);
      adminStore.fetchSchedules();
    } catch {
      message.error("Ошибка");
    }
  };

  const dataSource = adminStore.schedules.length
    ? adminStore.schedules
    : [0, 1, 2, 3, 4, 5, 6].map((d) => ({
        dayOfWeek: d,
        openTime: "09:00",
        closeTime: "22:00",
      }));

  if (editing) {
    return (
      <Form form={form} onFinish={handleSave} layout="vertical">
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <div key={d} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
            <span style={{ width: 140 }}>{DAY_NAMES[d]}</span>
            <Form.Item name={[`day_${d}`, "openTime"]} label="Открытие" style={{ marginBottom: 0 }}>
              <Input placeholder="09:00" style={{ width: 80 }} />
            </Form.Item>
            <Form.Item name={[`day_${d}`, "closeTime"]} label="Закрытие" style={{ marginBottom: 0 }}>
              <Input placeholder="22:00" style={{ width: 80 }} />
            </Form.Item>
          </div>
        ))}
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Сохранить
        </Button>
        <Button onClick={() => setEditing(false)}>Отмена</Button>
      </Form>
    );
  }

  return (
    <>
      <Button type="primary" onClick={() => setEditing(true)} style={{ marginBottom: 16 }}>
        Редактировать расписание
      </Button>
      <Table
        loading={adminStore.loading}
        dataSource={dataSource}
        rowKey="dayOfWeek"
        pagination={false}
        columns={[
          {
            title: "День",
            dataIndex: "dayOfWeek",
            render: (v: number) => DAY_NAMES[v],
          },
          { title: "Открытие", dataIndex: "openTime" },
          { title: "Закрытие", dataIndex: "closeTime" },
        ]}
      />
    </>
  );
}
