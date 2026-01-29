import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

async function wrappedHandler(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    return await handler(req, context);
  } catch (err) {
    console.error("[NextAuth]", err);
    return NextResponse.json(
      {
        error: "Configuration",
        message:
          process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL
            ? "Server error"
            : "Set NEXTAUTH_SECRET and NEXTAUTH_URL in environment",
      },
      { status: 500 }
    );
  }
}

export { wrappedHandler as GET, wrappedHandler as POST };
