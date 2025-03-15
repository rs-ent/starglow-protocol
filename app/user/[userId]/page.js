import { getUserDataByDocId } from "../../firebase/user-data";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import UserPageClient from "./UserPageClient";

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

  return (
    <UserPageClient userData={userData} owner={userId === activeUser?.docId} />
  );
}
