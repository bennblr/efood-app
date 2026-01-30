import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  getAdminRestaurantId,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

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

  const list = await prisma.order.findMany({
    where: { restaurantId },
    include: {
      user: { select: { id: true, name: true, username: true } },
      items: { include: { product: true } },
      reservation: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    list.map((o) => ({
      id: o.id,
      restaurantId: o.restaurantId,
      reservationId: o.reservationId,
      userId: o.userId,
      type: o.type,
      status: o.status,
      totalAmount: Number(o.totalAmount),
      comment: o.comment,
      createdAt: o.createdAt.toISOString(),
      user: o.user,
      items: o.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        priceAtTime: Number(i.priceAtTime),
        comment: i.comment,
        product: i.product
          ? { id: i.product.id, title: i.product.title }
          : null,
      })),
      reservation: o.reservation
        ? {
            id: o.reservation.id,
            startTime: o.reservation.startTime.toISOString(),
            endTime: o.reservation.endTime.toISOString(),
            personsCount: o.reservation.personsCount,
          }
        : null,
    }))
  );
}
