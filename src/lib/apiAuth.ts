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
): Promise<{ userId: string; role: string; restaurantId: string | null } | null> {
  const token = await getToken({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: req as any,
    secret: JWT_SECRET,
  });
  if (!token?.id || !token?.role) return null;
  return {
    userId: token.id as string,
    role: token.role as string,
    restaurantId: (token.restaurantId as string) ?? null,
  };
}

export function requireAdmin(role: string): boolean {
  return role === "admin" || role === "employee";
}

/** Платформа: админ без привязки к ресторану (может управлять всеми ресторанами) */
export function isPlatformAdmin(role: string, restaurantId: string | null): boolean {
  return role === "admin" && restaurantId == null;
}

/** Ресторан для админ-операций: из сессии (админ ресторана) или из query/body (платформа) */
export async function getAdminRestaurantId(
  req: Request,
  fromBody?: string | null
): Promise<string | null> {
  const user = await getCurrentUserRole(req);
  if (!user) return null;
  if (user.restaurantId) return user.restaurantId;
  if (fromBody) return fromBody;
  const url = new URL(req.url);
  return url.searchParams.get("restaurantId");
}

export type AdminUser = { userId: string; role: string; restaurantId: string | null };

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
