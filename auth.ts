import {PrismaAdapter} from "@auth/prisma-adapter";
import {compare} from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {getServerSession, type NextAuthOptions} from "next-auth";

import {prisma} from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {email: email.toLowerCase()},
        });

        if (!user) {
          return null;
        }

        const validPassword = await compare(password, user.passwordHash);
        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}) {
      if (session.user && typeof token.id === "string") {
        const userExists = await prisma.user.findUnique({
          where: {id: token.id},
          select: {id: true},
        });
        if (userExists) {
          session.user.id = token.id;
        } else {
          // If database was reset/migrated and user no longer exists, invalidate the session's id
          session.user.id = "";
        }
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);

export default NextAuth(authOptions);
