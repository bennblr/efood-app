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
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
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

  const allowed = [
    "new",
    "confirmed",
    "in_progress",
    "ready",
    "completed",
    "cancelled",
  ];
  if (!status || !allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const current = await prisma.order.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const allowedNext = ALLOWED[current.status] ?? [];
  if (!allowedNext.includes(status)) {
    return NextResponse.json(
      { error: `Transition ${current.status} -> ${status} not allowed` },
      { status: 400 }
    );
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });
  await createAuditLog(user.userId, "UPDATE_ORDER_STATUS", "order", id);
  return NextResponse.json({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
  });
}
