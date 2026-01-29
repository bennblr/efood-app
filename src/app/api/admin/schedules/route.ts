import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  getAdminRestaurantId,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

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

  const list = await prisma.menuSchedule.findMany({
    where: { restaurantId },
    orderBy: { dayOfWeek: "asc" },
  });
  return NextResponse.json(
    list.map((s) => ({
      id: s.id,
      restaurantId: s.restaurantId,
      dayOfWeek: s.dayOfWeek,
      openTime: s.openTime,
      closeTime: s.closeTime,
    }))
  );
}

export async function PUT(req: NextRequest) {
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

  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Array of schedules required" },
      { status: 400 }
    );
  }

  await prisma.menuSchedule.deleteMany({ where: { restaurantId } });
  for (const item of body) {
    const { dayOfWeek, openTime, closeTime } = item;
    if (
      typeof dayOfWeek !== "number" ||
      dayOfWeek < 0 ||
      dayOfWeek > 6 ||
      !openTime ||
      !closeTime
    )
      continue;
    await prisma.menuSchedule.create({
      data: { restaurantId, dayOfWeek, openTime, closeTime },
    });
  }
  await createAuditLog(user.userId, "UPDATE_SCHEDULES", "menu_schedule", restaurantId, restaurantId);
  const list = await prisma.menuSchedule.findMany({
    where: { restaurantId },
    orderBy: { dayOfWeek: "asc" },
  });
  return NextResponse.json(
    list.map((s) => ({
      id: s.id,
      restaurantId: s.restaurantId,
      dayOfWeek: s.dayOfWeek,
      openTime: s.openTime,
      closeTime: s.closeTime,
    }))
  );
}
