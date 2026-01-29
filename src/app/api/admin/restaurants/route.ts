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

export async function GET(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const restaurants = await prisma.restaurant.findMany({
    orderBy: { name: "asc" },
  });

  if (!isPlatformAdmin(user.role, user.restaurantId)) {
    const mine = restaurants.filter((r) => r.id === user.restaurantId);
    return NextResponse.json(
      mine.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        imageUrl: r.imageUrl,
        createdAt: r.createdAt.toISOString(),
      }))
    );
  }

  return NextResponse.json(
    restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      imageUrl: r.imageUrl,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!isPlatformAdmin(user.role, user.restaurantId)) return forbidden();

  const body = await req.json();
  const { name, slug, description, imageUrl } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "name and slug required" },
      { status: 400 }
    );
  }

  const slugNormalized = String(slug).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (!slugNormalized) {
    return NextResponse.json(
      { error: "Invalid slug" },
      { status: 400 }
    );
  }

  const existing = await prisma.restaurant.findUnique({
    where: { slug: slugNormalized },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Restaurant with this slug already exists" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      slug: slugNormalized,
      description: description ?? null,
      imageUrl: imageUrl ?? null,
    },
  });
  await createAuditLog(user.userId, "CREATE_RESTAURANT", "restaurant", restaurant.id);
  return NextResponse.json({
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    imageUrl: restaurant.imageUrl,
    createdAt: restaurant.createdAt.toISOString(),
  });
}
