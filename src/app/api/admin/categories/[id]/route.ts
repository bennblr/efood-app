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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const category = await prisma.category.findFirst({
    where: { id, restaurantId },
  });
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, description } = body;
  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;

  const updated = await prisma.category.update({
    where: { id },
    data,
  });
  await createAuditLog(user.userId, "UPDATE_CATEGORY", "category", updated.id, restaurantId);
  return NextResponse.json({
    id: updated.id,
    restaurantId: updated.restaurantId,
    title: updated.title,
    description: updated.description,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const category = await prisma.category.findFirst({
    where: { id, restaurantId },
  });
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.category.delete({ where: { id } });
  await createAuditLog(user.userId, "DELETE_CATEGORY", "category", id, restaurantId);
  return NextResponse.json({ ok: true });
}
