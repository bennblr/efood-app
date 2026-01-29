import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

const ALLOWED: Record<string, string[]> = {
  new: ["confirmed", "cancelled"],
  confirmed: ["cancelled", "completed"],
  cancelled: [],
  completed: [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const allowed = ["new", "confirmed", "cancelled", "completed"];
  if (!status || !allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const current = await prisma.reservation.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.restaurantId && current.restaurantId !== user.restaurantId) {
    return forbidden();
  }
  const allowedNext = ALLOWED[current.status] ?? [];
  if (!allowedNext.includes(status)) {
    return NextResponse.json(
      { error: `Transition ${current.status} -> ${status} not allowed` },
      { status: 400 }
    );
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status },
  });
  await createAuditLog(
    user.userId,
    "UPDATE_RESERVATION_STATUS",
    "reservation",
    id,
    current.restaurantId
  );
  return NextResponse.json({
    id: reservation.id,
    status: reservation.status,
    startTime: reservation.startTime.toISOString(),
    endTime: reservation.endTime.toISOString(),
    personsCount: reservation.personsCount,
  });
}
