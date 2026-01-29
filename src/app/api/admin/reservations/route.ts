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

  const list = await prisma.reservation.findMany({
    where: { restaurantId },
    include: { user: { select: { id: true, name: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    list.map((r) => ({
      id: r.id,
      restaurantId: r.restaurantId,
      userId: r.userId,
      status: r.status,
      startTime: r.startTime.toISOString(),
      endTime: r.endTime.toISOString(),
      personsCount: r.personsCount,
      createdAt: r.createdAt.toISOString(),
      user: r.user,
    }))
  );
}
