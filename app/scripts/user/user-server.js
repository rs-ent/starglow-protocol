import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

const sessionOptions = {
    cookieName: "SESSION_COOKIE",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getServerSessionUserData() {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    if(!session) {
        return null;
    }
    
    const user = session.user;
    if(!user) {
        return null;
    }

    return user;
}