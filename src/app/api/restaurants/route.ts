import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(
    restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      imageUrl: r.imageUrl,
      minOrderAmount: r.minOrderAmount != null ? Number(r.minOrderAmount) : null,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}
