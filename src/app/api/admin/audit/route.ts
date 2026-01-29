import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const list = await prisma.auditLog.findMany({
    include: { user: { select: { id: true, name: true, username: true } } },
    orderBy: { timestamp: "desc" },
    take: 200,
  });
  return NextResponse.json(
    list.map((a) => ({
      id: a.id,
      userId: a.userId,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId,
      timestamp: a.timestamp.toISOString(),
      user: a.user,
    }))
  );
}
