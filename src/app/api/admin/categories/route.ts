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

  const list = await prisma.category.findMany({
    where: { restaurantId },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(
    list.map((c) => ({
      id: c.id,
      restaurantId: c.restaurantId,
      title: c.title,
      description: c.description,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const body = await req.json();
  const { restaurantId: bodyRestaurantId, title, description } = body;
  const restaurantId = await getAdminRestaurantId(req, bodyRestaurantId);
  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurantId required (body or session)" },
      { status: 400 }
    );
  }
  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { restaurantId, title, description: description ?? null },
  });
  await createAuditLog(user.userId, "CREATE_CATEGORY", "category", category.id, restaurantId);
  return NextResponse.json({
    id: category.id,
    restaurantId: category.restaurantId,
    title: category.title,
    description: category.description,
  });
}
