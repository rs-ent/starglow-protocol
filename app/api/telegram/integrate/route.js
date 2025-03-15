/// app\api\telegram\integrate\route.js

import crypto from "crypto";
import { updateUserData  } from "../../../firebase/user-data";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

const sessionOptions = {
  cookieName: "SESSION_COOKIE",
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function POST(req) {
    const { telegramData } = await req.json();

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!TELEGRAM_BOT_TOKEN) {
        return Response.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    const activeUser = session.user;
    if (!activeUser || !activeUser.docId) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const dataCheckString = Object.keys(telegramData)
        .filter(key => telegramData[key] && key !== "hash")
        .sort()
        .map(key => `${key}=${telegramData[key]}`)
        .join("\n");

    const secretKey = crypto
        .createHash("sha256")
        .update(TELEGRAM_BOT_TOKEN)
        .digest();

    const hmac = crypto
        .createHmac("sha256", secretKey)
        .update(dataCheckString)
        .digest("hex");

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime - telegramData.auth_date > 300 || hmac !== telegramData.hash) {
        return Response.json({ success: false, message: "Auth Date expired or Invalid data" });
    }

    const userDocId = activeUser.docId;
    await updateUserData(userDocId, {
        telegram: {
            telegram_id: telegramData.id,
            username: telegramData.username || '',
            first_name: telegramData.first_name || '',
            last_name: telegramData.last_name || '',
            photo_url: telegramData.photo_url || null,
            auth_date: telegramData.auth_date || null,
            linked_at: new Date().toISOString(),
            deprecated: false,
        }
    });

    return Response.json({
        success: true,
        message: "Telegram data has been integrated",
        telegramData,
    });
}
