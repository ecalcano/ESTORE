import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { adapter } from "next/dist/server/web/adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const config = {
  //  Custom sign-in and error pages.
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  //  JWT-based session strategy with a max age of 30 days.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  //  adapter: Prisma adapter for database integration.
  adapter: PrismaAdapter(prisma),
  //  Credentials provider for email/password authentication
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      //  Function to authorize users based on credentials.
      async authorize(credentials) {
        if (credentials == null) return null;
        //  Use prisma to find user by email and store in user variable.
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // If user exists and has a password, compare the password with the credentials using bCrypt.
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // if password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if password is incorrect, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      //set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //if update, set the user name

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      //assign user fields to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //if user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          //update database to reflect the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // Check for cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate cart cookie
        const sessionCartId = crypto.randomUUID();

        //clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        //create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        //set the newly generated sessionCardId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
export const { handlers, auth, signIn, signOut } = NextAuth(config);
