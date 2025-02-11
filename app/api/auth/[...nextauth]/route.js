// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Telegram",
      // 클라이언트에서 전달할 필드 정의 (여기서는 telegramUser라는 필드)
      credentials: {
        telegramUser: { label: "Telegram User", type: "text" },
      },
      async authorize(credentials, req) {
        // credentials 객체에 telegramUser가 있는지 확인합니다.
        if (!credentials || !credentials.telegramUser) {
          return null;
        }

        let user;
        try {
          // 클라이언트에서 전달한 JSON 문자열을 파싱합니다.
          user = JSON.parse(credentials.telegramUser);
        } catch (error) {
          console.error("Invalid telegramUser JSON", error);
          return null;
        }

        // 예시로 필수 필드가 있는지 검증합니다.
        // 실제 환경에서는 Telegram에서 전달받은 데이터에 대한 서명 검증 로직을 추가하세요.
        if (!user.id) {
          return null;
        }

        // 모든 검증이 통과하면 user 객체를 반환하여 인증에 성공합니다.
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT 기반 세션 사용
  },
  callbacks: {
    async jwt({ token, user }) {
      // 인증 시 user 객체가 있다면 토큰에 병합합니다.
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트 세션에 user 정보를 추가합니다.
      session.user = token;
      return session;
    },
  },
});

// GET, POST 요청 모두 처리
export { handler as GET, handler as POST };
