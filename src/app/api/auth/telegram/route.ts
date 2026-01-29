import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData, parseTelegramInitData } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const initData = body?.initData as string | undefined;

  if (!initData || !BOT_TOKEN) {
    return NextResponse.json(
      { error: "initData or BOT_TOKEN missing" },
      { status: 400 }
    );
  }

  if (!validateTelegramInitData(initData, BOT_TOKEN)) {
    return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
  }

  const { user: tgUser } = parseTelegramInitData(initData);
  if (!tgUser) {
    return NextResponse.json({ error: "No user in initData" }, { status: 400 });
  }

  const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ");
  const user = await prisma.user.upsert({
    where: { telegramId: String(tgUser.id) },
    create: {
      telegramId: String(tgUser.id),
      name: name || null,
      username: tgUser.username ?? null,
      role: "customer",
    },
    update: {
      name: name || undefined,
      username: tgUser.username ?? undefined,
    },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      telegramId: user.telegramId,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
  });
}
