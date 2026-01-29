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
  const { title, description, price, imageUrl, available, categoryId } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (available !== undefined) data.available = Boolean(available);
  if (categoryId !== undefined) data.categoryId = categoryId;

  const product = await prisma.product.update({
    where: { id },
    data,
  });
  await createAuditLog(user.userId, "UPDATE_PRODUCT", "product", product.id);
  return NextResponse.json({
    id: product.id,
    categoryId: product.categoryId,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    available: product.available,
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
  await prisma.product.delete({ where: { id } });
  await createAuditLog(user.userId, "DELETE_PRODUCT", "product", id);
  return NextResponse.json({ ok: true });
}
