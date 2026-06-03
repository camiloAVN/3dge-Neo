import prisma from '@/lib/prisma';
import { CustomersClient } from './ui/CustomersClient';

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'user' },
    orderBy: { name: 'asc' },
    include: {
      address: {
        include: { country: { select: { name: true } } },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: {
                select: { title: true, slug: true, images: { take: 1, select: { url: true } } },
              },
            },
          },
          orderAddress: {
            include: { country: { select: { name: true } } },
          },
        },
      },
    },
  });

  return <CustomersClient customers={customers} />;
}
