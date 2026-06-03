import prisma from '@/lib/prisma';
import { OrdersClient } from './ui/OrdersClient';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { isPaid: true },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      orderAddress: {
        include: { country: { select: { name: true } } },
      },
      orderItems: {
        include: {
          product: {
            select: {
              title: true,
              slug: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
      },
    },
  });

  return <OrdersClient orders={orders} />;
}
