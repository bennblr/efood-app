import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId(req);
  if (!userId) return unauthorized();

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, username: true } },
      restaurant: { select: { id: true, name: true, slug: true } },
    },
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
      user: r.user,
      restaurant: r.restaurant,
    }))
  );
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId(req);
  if (!userId) return unauthorized();

  const body = await req.json();
  const { restaurantId, startTime, endTime, personsCount } = body;

  if (
    !restaurantId ||
    !startTime ||
    !endTime ||
    typeof personsCount !== "number" ||
    personsCount < 1
  ) {
    return NextResponse.json(
      { error: "restaurantId, startTime, endTime, personsCount required" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      restaurantId,
      userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      personsCount,
      status: "new",
    },
  });

  return NextResponse.json({
    id: reservation.id,
    restaurantId: reservation.restaurantId,
    userId: reservation.userId,
    status: reservation.status,
    startTime: reservation.startTime.toISOString(),
    endTime: reservation.endTime.toISOString(),
    personsCount: reservation.personsCount,
    createdAt: reservation.createdAt.toISOString(),
  });
}
