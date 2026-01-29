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
  const product = await prisma.product.findFirst({
    where: { id, category: { restaurantId } },
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, description, price, imageUrl, available, categoryId } = body;
  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (available !== undefined) data.available = Boolean(available);
  if (categoryId !== undefined) {
    const cat = await prisma.category.findFirst({
      where: { id: categoryId, restaurantId },
    });
    if (!cat) {
      return NextResponse.json({ error: "Category not in your restaurant" }, { status: 400 });
    }
    data.categoryId = categoryId;
  }

  const updated = await prisma.product.update({
    where: { id },
    data,
  });
  await createAuditLog(user.userId, "UPDATE_PRODUCT", "product", updated.id, restaurantId);
  return NextResponse.json({
    id: updated.id,
    categoryId: updated.categoryId,
    title: updated.title,
    description: updated.description,
    price: Number(updated.price),
    imageUrl: updated.imageUrl,
    available: updated.available,
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
  const product = await prisma.product.findFirst({
    where: { id, category: { restaurantId } },
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.product.delete({ where: { id } });
  await createAuditLog(user.userId, "DELETE_PRODUCT", "product", id, restaurantId);
  return NextResponse.json({ ok: true });
}
