"use client";

import { useEffect } from "react";
import { Table } from "antd";
import { adminStore } from "@/stores";

export function AdminAudit() {
  useEffect(() => {
    adminStore.fetchAuditLogs();
  }, []);

  return (
    <Table
      loading={adminStore.loading}
      dataSource={adminStore.auditLogs}
      rowKey="id"
      columns={[
        {
          title: "Время",
          dataIndex: "timestamp",
          render: (v: string) => new Date(v).toLocaleString("ru"),
        },
        { title: "Действие", dataIndex: "action" },
        { title: "Сущность", dataIndex: "entityType" },
        { title: "ID", dataIndex: "entityId", render: (v: string) => v?.slice(-8) ?? "—" },
        {
          title: "Пользователь",
          key: "user",
          render: (_, r) => (r as { user?: { name?: string } }).user?.name ?? "—",
        },
      ]}
    />
  );
}
