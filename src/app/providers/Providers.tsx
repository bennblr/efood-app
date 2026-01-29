"use client";

import { useEffect } from "react";
import { ConfigProvider, message } from "antd";
import ruRU from "antd/locale/ru_RU";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { setApiErrorHandler } from "@/lib/api";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    setApiErrorHandler((msg) => message.error(msg));
  }, []);

  return (
    <SessionProvider>
      <ConfigProvider locale={ruRU}>{children}</ConfigProvider>
    </SessionProvider>
  );
}
