/// app\user\[userId]\page.js

import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import UserContent from "./UserContent";
import { getUserDataByDocId } from "../../firebase/user-data";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

const sessionOptions = {
    cookieName: "SESSION_COOKIE",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};


export default async function UserPage({ params }) {
    const { userId } = await params;
    const userData = await getUserDataByDocId(userId);
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    const activeUser = session.user;
    console.log("Active user: ", activeUser);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <div className="container mx-auto w-[55%] p-20">
                <UserHeader userData={userData} owner={userId === activeUser.docId} />
                <div className="flex">
                    <UserSidebar userData={userData} owner={userId === activeUser.docId} />
                    <UserContent userData={userData} owner={userId === activeUser.docId} />
                </div>
            </div>
        </div>
    );
}