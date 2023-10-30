import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { User } from "@prisma/client";
import prisma from "@/prisma/prisma";

export enum AuthProviders {
  Credentials = "Credentials",
}

type CredentialsProps = {
  password: string;
  username: string;
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: AuthProviders.Credentials,
      id: AuthProviders.Credentials,
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials as CredentialsProps;

        const user = await prisma.user.findUnique({ where: { username } });

        if (
          !user ||
          !user.password ||
          !(await compare(password, user.password))
        ) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: { strategy: "jwt" },
  callbacks: {
    session: ({ session, token }: any) => {
      const user = {
        id: token.id,
        username: token.username,
        permissions: token.permissions,
        email: "no-one-carry@email.com",
        isAdmin: token.isAdmin,
      };
      return { expires: session.expires, user };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const { password, ...rest } = user as User;
        return { ...token, ...rest };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
