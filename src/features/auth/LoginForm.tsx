"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { userStore } from "@/stores";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (v: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const res = await signIn("credentials-phone", {
        redirect: false,
        phone: v.phone.trim(),
        password: v.password,
      });
      if (res?.error) {
        message.error("Неверный телефон или пароль");
        return;
      }
      const sessionRes = await fetch("/api/auth/session");
      const data = await sessionRes.json();
      userStore.setUser(data.user ?? null);
      message.success("Вход выполнен");
      router.push("/");
    } catch {
      message.error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="phone"
        label="Номер телефона"
        rules={[{ required: true, message: "Введите телефон" }]}
      >
        <Input placeholder="+7 999 123-45-67" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Пароль"
        rules={[{ required: true, message: "Введите пароль" }]}
      >
        <Input.Password placeholder="Пароль" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}
