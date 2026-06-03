import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { UsersClient } from './ui/UsersClient';

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = (session?.user as any)?.id ?? '';

  const users = await prisma.user.findMany({
    where: { role: 'admin' },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      cargo: true,
      isActive: true,
      role: true,
    },
  });

  return <UsersClient users={users} currentUserId={currentUserId} />;
}
