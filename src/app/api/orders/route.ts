import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId(req);
  if (!userId) return unauthorized();

  const body = await req.json();
  const { restaurantId, reservationId, type: orderType, comment: orderComment, items } = body;
  const type = orderType === "delivery" || orderType === "with_reservation" ? orderType : "dine_in";

  if (!restaurantId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "restaurantId and items array required" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      available: true,
      category: { restaurantId },
    },
  });
  const priceMap = new Map(products.map((p) => [p.id, p.price]));

  let totalAmount = new Decimal(0);
  const orderItems: { productId: string; quantity: number; priceAtTime: Decimal }[] = [];

  for (const item of items) {
    const price = priceMap.get(item.productId);
    if (!price || item.quantity < 1) continue;
    totalAmount = totalAmount.plus(price.times(item.quantity));
    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      priceAtTime: price,
    });
  }

  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "No valid items" },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      restaurantId,
      userId,
      reservationId: reservationId || null,
      type,
      status: "new",
      totalAmount,
      comment: orderComment ?? null,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: { include: { product: true } },
    },
  });

  return NextResponse.json({
    id: order.id,
    restaurantId: order.restaurantId,
    reservationId: order.reservationId,
    userId: order.userId,
    type: order.type,
    status: order.status,
    comment: order.comment,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
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
  });
}
