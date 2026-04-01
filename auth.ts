import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string },
          include: { eventAdmins: { include: { event: true } } },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );
        if (!valid) return null;

        // Super-admin: no event scope
        if (user.isSuperAdmin) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isSuperAdmin: true,
            eventId: null,
          };
        }

        // Event admin: must belong to at least one event
        const firstAssignment = user.eventAdmins[0];
        if (!firstAssignment) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isSuperAdmin: false,
          eventId: firstAssignment.eventId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isSuperAdmin = (user as any).isSuperAdmin;
        token.eventId = (user as any).eventId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.isSuperAdmin = token.isSuperAdmin as boolean;
      session.user.eventId = token.eventId as string | null;
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
});
