"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Select, message } from "antd";
import { adminStore } from "@/stores";

export function AdminProducts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    adminStore.fetchCategories();
    adminStore.fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    available: boolean;
    categoryId: string;
  }) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    try {
      if (editingId) {
        await fetch(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });
        message.success("Обновлено");
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });
        message.success("Создано");
      }
      setModalOpen(false);
      adminStore.fetchProducts();
    } catch {
      message.error("Ошибка");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить блюдо?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      message.success("Удалено");
      adminStore.fetchProducts();
    } catch {
      message.error("Ошибка");
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Добавить блюдо
      </Button>
      <Table
        loading={adminStore.loading}
        dataSource={adminStore.products}
        rowKey="id"
        columns={[
          { title: "Название", dataIndex: "title" },
          { title: "Цена", dataIndex: "price", render: (v: number) => `${v} ₽` },
          {
            title: "Доступно",
            dataIndex: "available",
            render: (v: boolean) => (v ? "Да" : "Нет"),
          },
          {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
              <>
                <Button size="small" onClick={() => handleEdit(record)}>
                  Изменить
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleDelete(record.id)}
                  style={{ marginLeft: 8 }}
                >
                  Удалить
                </Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={editingId ? "Изменить блюдо" : "Новое блюдо"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true }]}
          >
            <Select
              options={adminStore.categories.map((c) => ({
                value: c.id,
                label: c.title,
              }))}
            />
          </Form.Item>
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL изображения">
            <Input />
          </Form.Item>
          <Form.Item name="available" label="Доступно" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
