import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/password";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, password, name } = body;

  if (!phone || !password) {
    return NextResponse.json(
      { error: "Укажите телефон и пароль" },
      { status: 400 }
    );
  }

  const normalized = normalizePhone(phone);
  if (!normalized || normalized.length < 10) {
    return NextResponse.json(
      { error: "Некорректный номер телефона" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Пароль не менее 6 символов" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { phone: normalized },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Пользователь с таким телефоном уже зарегистрирован" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      phone: normalized,
      passwordHash,
      name: name?.trim() || null,
      role: "customer",
    },
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    },
  });
}
