import prisma from '@/lib/db/prisma';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import type { JWT } from "next-auth/jwt";
import bcrypt from 'bcrypt';

// Utils
import type { User as PrismaUser } from '@prisma/client';
import { signInSchema } from '@/lib/config';


declare module "next-auth" {
    interface User extends PrismaUser {}

    interface Session {
        user: {
            isAdmin: boolean
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        isAdmin: boolean,
        id: string
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    // adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const { success, data } = await signInSchema.safeParseAsync(credentials);
                if (!success) return null;

                const { email, password } = data;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                // if (!user.isVerified) return null;

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return null;

                return { ...user, id: user.id.toString() }; // TODO?
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            // Inject `user` fields into the encoded JWT token.
            // Note: despite the library typing, `user` can be undefined here.
            if (user) {
                token.isAdmin = user.isAdmin;
                token.id = user.id!;
            }

            return token;
        },
        session({ session, token }) {
            // Inject parsed JWT token fields into the session object.
            session.user.isAdmin = token.isAdmin;
            session.user.id = token.id;

            return session;
        }
    }
});
