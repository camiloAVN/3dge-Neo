import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from '@/auth.config';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return null;
  if (!user.password) return null; // cuenta creada via OAuth
  if (!bcrypt.compareSync(password, user.password)) return null;
  const { password: _, ...rest } = user;
  return rest;
}

export const {
  auth,
  signIn,
  signOut,
  handlers
} = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email, password);
        if (!user) return null;
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
});
