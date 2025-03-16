import { getServerSessionUserData } from "../scripts/user/user-server";
import { redirect } from "next/navigation";
import UserPending from "./UserPending";

const sessionOptions = {
    cookieName: "SESSION_COOKIE",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export default async function ProfilePage() {
    const user = await getServerSessionUserData();

    if (user && user.docId) {
        redirect(`/user/${user.docId}`);
    }

    return (
        <div className="bg-black">
            <UserPending />
        </div>
    )
}