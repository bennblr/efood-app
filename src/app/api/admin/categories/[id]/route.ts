import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
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

  const { id } = await params;
  const body = await req.json();
  const { title, description } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;

  const category = await prisma.category.update({
    where: { id },
    data,
  });
  await createAuditLog(user.userId, "UPDATE_CATEGORY", "category", category.id);
  return NextResponse.json({
    id: category.id,
    title: category.title,
    description: category.description,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserRole(_req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  await createAuditLog(user.userId, "DELETE_CATEGORY", "category", id);
  return NextResponse.json({ ok: true });
}
