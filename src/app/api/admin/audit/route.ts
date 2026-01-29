import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  getAdminRestaurantId,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const restaurantId = await getAdminRestaurantId(req);
  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurantId required (query or session)" },
      { status: 400 }
    );
  }

  const list = await prisma.auditLog.findMany({
    where: { restaurantId },
    include: { user: { select: { id: true, name: true, username: true } } },
    orderBy: { timestamp: "desc" },
    take: 200,
  });
  return NextResponse.json(
    list.map((a) => ({
      id: a.id,
      userId: a.userId,
      restaurantId: a.restaurantId,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId,
      timestamp: a.timestamp.toISOString(),
      user: a.user,
    }))
  );
}
