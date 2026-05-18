import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

// 1. IMPORT YOUR EXISTING db HERE
import { db } from "@/lib/db"; 

export const authOptions: NextAuthOptions = {
  // 2. PASS YOUR db TO THE ADAPTER
  adapter: PrismaAdapter(db) as any,
  
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  
  session: { strategy: "jwt" },
  
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/auth/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };