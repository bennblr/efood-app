import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    telegramId?: string;
    role?: string;
    restaurantId?: string;
  }

  interface Session {
    user?: User & { id?: string; telegramId?: string; role?: string; restaurantId?: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    telegramId?: string;
    role?: string;
    restaurantId?: string;
  }
}
