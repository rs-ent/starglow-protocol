/// app\api\session-storage\user\route.js

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
  const body = await req.json();
  const { userData } = body;
  if (!userData) {
    return NextResponse.json(
      { success: false, message: "Missing user data" },
      { status: 400 }
    );
  }

  session.user = userData;
  await session.save();
  return NextResponse.json({ success: true, message: "User data saved" });
}

export async function GET(req) {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  const user = session.user;
  if (!user) {
    return NextResponse.json(
      { success: false, message: "No user data found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, user });
}