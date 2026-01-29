"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, Typography, Card, message } from "antd";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Ошибка настройки сервера. Проверьте NEXTAUTH_URL и NEXTAUTH_SECRET в переменных окружения.",
  AccessDenied: "Доступ запрещён.",
  Verification: "Ошибка проверки. Ссылка могла устареть.",
  Default: "Произошла ошибка при входе. Попробуйте снова.",
};

export function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      message.error(ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default);
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams]);

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
