"use client";

import { Tabs, Typography, Card } from "antd";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: "24px auto" }}>
      <Typography.Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
        Вход в приложение
      </Typography.Title>
      <Card>
        <Tabs
          items={[
            { key: "login", label: "Вход", children: <LoginForm /> },
            { key: "register", label: "Регистрация", children: <RegisterForm /> },
          ]}
        />
      </Card>
    </div>
  );
}
