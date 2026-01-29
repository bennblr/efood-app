import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId(req);
  if (!userId) return unauthorized();

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { restaurant: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json(
    reservations.map((r) => ({
      id: r.id,
      restaurantId: r.restaurantId,
      userId: r.userId,
      status: r.status,
      startTime: r.startTime.toISOString(),
      endTime: r.endTime.toISOString(),
      personsCount: r.personsCount,
      createdAt: r.createdAt.toISOString(),
      restaurant: r.restaurant,
    }))
  );
}
