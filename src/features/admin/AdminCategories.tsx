"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { adminStore } from "@/stores";
import { apiFetch } from "@/lib/api";

export function AdminCategories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    adminStore.fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (id: string, record: { title: string; description?: string | null }) => {
    setEditingId(id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    try {
      if (editingId) {
        await apiFetch(`/api/admin/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });
        message.success("Обновлено");
      } else {
        await apiFetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });
        message.success("Создано");
      }
      setModalOpen(false);
      adminStore.fetchCategories();
    } catch {
      // Ошибка уже показана через apiFetch
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить категорию?")) return;
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      message.success("Удалено");
      adminStore.fetchCategories();
    } catch {
      // Ошибка уже показана через apiFetch
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Добавить категорию
      </Button>
      <Table
        loading={adminStore.loading}
        dataSource={adminStore.categories}
        rowKey="id"
        columns={[
          { title: "Название", dataIndex: "title" },
          { title: "Описание", dataIndex: "description" },
          {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
              <>
                <Button size="small" onClick={() => handleEdit(record.id, record)}>
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
        title={editingId ? "Изменить категорию" : "Новая категория"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
