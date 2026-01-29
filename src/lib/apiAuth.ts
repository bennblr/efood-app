import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.NEXTAUTH_SECRET ?? "";

export async function getCurrentUserId(req: Request): Promise<string | null> {
  const token = await getToken({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: req as any,
    secret: JWT_SECRET,
  });
  return (token?.id as string) ?? null;
}

export async function getCurrentUserRole(
  req: Request
): Promise<{ userId: string; role: string } | null> {
  const token = await getToken({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: req as any,
    secret: JWT_SECRET,
  });
  if (!token?.id || !token?.role) return null;
  return { userId: token.id as string, role: token.role as string };
}

export function requireAdmin(role: string): boolean {
  return role === "admin" || role === "employee";
}

export type AdminUser = { userId: string; role: string };

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
