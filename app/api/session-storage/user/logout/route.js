/// app\api\session-storage\user\logout\route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";

const sessionOptions = {
  cookieName: "SESSION_COOKIE",
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function POST(req) {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    await session.destroy();
    return NextResponse.json({ success: true, message: "User logged out" });
}