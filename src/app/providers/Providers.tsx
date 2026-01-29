"use client";

import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ConfigProvider locale={ruRU}>{children}</ConfigProvider>
    </SessionProvider>
  );
}
