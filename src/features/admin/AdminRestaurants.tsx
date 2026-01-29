"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { adminStore } from "@/stores";
import { apiFetch } from "@/lib/api";

export function AdminRestaurants() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    adminStore.fetchRestaurants();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (
    id: string,
    record: { name: string; slug: string; description?: string | null; imageUrl?: string | null }
  ) => {
    setEditingId(id);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      description: record.description ?? "",
      imageUrl: record.imageUrl ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    try {
      if (editingId) {
        await apiFetch(`/api/admin/restaurants/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: v.name,
            slug: v.slug,
            description: v.description || null,
            imageUrl: v.imageUrl || null,
          }),
        });
        message.success("Ресторан обновлён");
      } else {
        await apiFetch("/api/admin/restaurants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: v.name,
            slug: v.slug,
            description: v.description || null,
            imageUrl: v.imageUrl || null,
          }),
        });
        message.success("Ресторан создан");
      }
      setModalOpen(false);
      adminStore.fetchRestaurants();
    } catch {
      // Ошибка уже показана через apiFetch
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить ресторан? Будут удалены все категории, блюда, брони и заказы.")) return;
    try {
      await apiFetch(`/api/admin/restaurants/${id}`, { method: "DELETE" });
      message.success("Ресторан удалён");
      adminStore.fetchRestaurants();
    } catch {
      // Ошибка уже показана через apiFetch
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Добавить ресторан
      </Button>
      <Table
        loading={adminStore.loading}
        dataSource={adminStore.restaurants}
        rowKey="id"
        columns={[
          { title: "Название", dataIndex: "name" },
          { title: "Slug", dataIndex: "slug" },
          { title: "Описание", dataIndex: "description", ellipsis: true },
          {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
              <>
                <Button type="link" size="small" onClick={() => handleEdit(record.id, record)}>
                  Изменить
                </Button>
                <Button type="link" danger size="small" onClick={() => handleDelete(record.id)}>
                  Удалить
                </Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={editingId ? "Изменить ресторан" : "Новый ресторан"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug (латиница, дефисы)"
            rules={[{ required: true }]}
          >
            <Input placeholder="my-restaurant" />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL изображения">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
