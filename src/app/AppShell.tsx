"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { signIn, signOut } from "next-auth/react";
import { Layout, Menu, Spin } from "antd";
import { userStore } from "@/stores";
import { Providers } from "./providers/Providers";
import { CartReplaceConfirmModal } from "@/features/cart/CartReplaceConfirmModal";
import styles from "./AppShell.module.css";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

const NAV_ITEMS = [
  { key: "/", label: "Рестораны" },
  { key: "/cart", label: "Корзина" },
  { key: "/reservation", label: "Бронирование" },
  { key: "/orders", label: "Мои заказы" },
  { key: "/my-reservations", label: "Мои брони" },
];

const ADMIN_NAV = [{ key: "/admin", label: "Админка" }];

function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.Telegram?.WebApp?.initData);
}

const AppShellInnerBase = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith("/admin");
  const fromTelegram = isTelegramWebApp();

  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;
    userStore.setLoading(true);

    const initData =
      typeof window !== "undefined" ? window.Telegram?.WebApp?.initData : undefined;

    const finishAuth = () => {
      fetch("/api/auth/session")
        .then((r) => r.json())
        .then((data) => {
          userStore.setUser(data.user ?? null);
        })
        .catch(() => userStore.setUser(null))
        .finally(() => userStore.setLoading(false));
    };

    if (initData) {
      signIn("telegram-init-data", { initData, redirect: false })
        .then(() => finishAuth())
        .catch(() => finishAuth());
    } else {
      finishAuth();
    }
  }, []);

  const navItems = isAdmin
    ? ADMIN_NAV
    : [
        ...NAV_ITEMS,
        ...(userStore.isAdmin ? ADMIN_NAV : []),
        ...(!userStore.user && !fromTelegram
          ? [{ key: "/login", label: "Вход" }]
          : fromTelegram
            ? []
            : [{ key: "signout", label: "Выйти" }]),
      ];

  if (userStore.loading) {
    return (
      <div className={styles.sessionLoader}>
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname ?? "/"]}
          items={navItems}
          onClick={({ key }) => {
            if (key === "signout") {
              signOut({ redirect: false });
              userStore.setUser(null);
              router.push("/");
            } else {
              router.push(key);
            }
          }}
          className={styles.menu}
        />
      </Layout.Header>
      <Layout.Content className={styles.content}>
        {children}
      </Layout.Content>
      <CartReplaceConfirmModal />
    </Layout>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppShellInner>{children}</AppShellInner>
    </Providers>
  );
};

const AppShellInner = observer(AppShellInnerBase);

export default AppShellInner;
