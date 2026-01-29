"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const AppShell = dynamic(
  () => import("./AppShell").then((m) => m.AppShell),
  { ssr: false }
);

export function ClientRoot({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
