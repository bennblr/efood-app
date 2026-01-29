"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { userStore } from "@/stores";
import { apiFetch } from "@/lib/api";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (v: {
    phone: string;
    password: string;
    name?: string;
  }) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: v.phone.trim(),
          password: v.password,
          name: v.name?.trim(),
        }),
      });
      const data = await res.json();
      const signInRes = await signIn("credentials-phone", {
        redirect: false,
        phone: v.phone.trim(),
        password: v.password,
      });
      if (signInRes?.error) {
        message.success("Регистрация успешна. Войдите в систему.");
        router.push("/login");
        return;
      }
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      userStore.setUser(sessionData.user ?? null);
      message.success("Регистрация выполнена");
      router.push("/");
    } catch {
      message.error("Ошибка регистрации");
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
        rules={[
          { required: true, message: "Введите пароль" },
          { min: 6, message: "Не менее 6 символов" },
        ]}
      >
        <Input.Password placeholder="Пароль" />
      </Form.Item>
      <Form.Item name="name" label="Имя (необязательно)">
        <Input placeholder="Как к вам обращаться" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
}
