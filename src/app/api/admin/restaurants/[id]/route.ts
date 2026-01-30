import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  unauthorized,
  forbidden,
  isPlatformAdmin,
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
  if (!isPlatformAdmin(user.role, user.restaurantId)) return forbidden();

  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, imageUrl, minOrderAmount } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (minOrderAmount !== undefined) data.minOrderAmount = minOrderAmount != null ? Number(minOrderAmount) : null;
  if (slug !== undefined) {
    const slugNormalized = String(slug).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (slugNormalized) data.slug = slugNormalized;
  }

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data,
  });
  await createAuditLog(user.userId, "UPDATE_RESTAURANT", "restaurant", restaurant.id);
  return NextResponse.json({
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    imageUrl: restaurant.imageUrl,
    minOrderAmount: restaurant.minOrderAmount != null ? Number(restaurant.minOrderAmount) : null,
    createdAt: restaurant.createdAt.toISOString(),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserRole(_req);
  if (!user) return unauthorized();
  if (!isPlatformAdmin(user.role, user.restaurantId)) return forbidden();

  const { id } = await params;
  await prisma.restaurant.delete({ where: { id } });
  await createAuditLog(user.userId, "DELETE_RESTAURANT", "restaurant", id);
  return NextResponse.json({ ok: true });
}
