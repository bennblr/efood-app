import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateTelegramInitData, parseTelegramInitData } from "./telegram";
import { verifyPassword, normalizePhone } from "./password";
import { prisma } from "./prisma";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "telegram-init-data",
      name: "Telegram",
      credentials: {
        initData: { label: "Init Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.initData || !BOT_TOKEN) return null;
        if (!validateTelegramInitData(credentials.initData, BOT_TOKEN)) return null;

        const { user: tgUser } = parseTelegramInitData(credentials.initData);
        if (!tgUser) return null;

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

        return {
          id: user.id,
          telegramId: user.telegramId ?? undefined,
          name: user.name,
          email: null,
          image: null,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      id: "credentials-phone",
      name: "Телефон и пароль",
      credentials: {
        phone: { label: "Телефон", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;
        const phone = normalizePhone(credentials.phone);
        if (!phone || phone.length < 10) return null;

        const user = await prisma.user.findUnique({
          where: { phone },
        });
        if (!user?.passwordHash) return null;
        const ok = await verifyPassword(credentials.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          telegramId: undefined,
          name: user.name,
          email: null,
          image: null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.telegramId = (user as { telegramId?: string }).telegramId;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { telegramId?: string }).telegramId = token.telegramId as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
