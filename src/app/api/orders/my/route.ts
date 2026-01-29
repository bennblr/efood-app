import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId(req);
  if (!userId) return unauthorized();

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      reservation: true,
    },
  });

  return NextResponse.json(
    orders.map((o) => ({
      id: o.id,
      reservationId: o.reservationId,
      userId: o.userId,
      status: o.status,
      totalAmount: Number(o.totalAmount),
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        quantity: i.quantity,
        priceAtTime: Number(i.priceAtTime),
        comment: i.comment,
        product: i.product
          ? {
              id: i.product.id,
              title: i.product.title,
              price: Number(i.product.price),
            }
          : undefined,
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
