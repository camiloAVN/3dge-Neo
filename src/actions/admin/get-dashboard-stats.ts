'use server';

import prisma from '@/lib/prisma';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export async function getDashboardStats() {
  const now        = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalCategories,
    totalProducts,
    totalOrders,
    totalCustomers,
    totalAdmins,
    revenueAgg,
    paidOrdersThisYear,
    newCustomersThisYear,
    topProductsRaw,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { isPaid: true },
    }),
    prisma.order.findMany({
      where: { isPaid: true, createdAt: { gte: startOfYear } },
      select: { createdAt: true, total: true },
    }),
    prisma.user.findMany({
      where: { role: 'user', createdAt: { gte: startOfYear } },
      select: { createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 8,
    }),
  ]);

  // Monthly revenue
  const monthlyRevenue = MONTHS.map(month => ({ month, ingresos: 0 }));
  paidOrdersThisYear.forEach(o => {
    monthlyRevenue[new Date(o.createdAt).getMonth()].ingresos += o.total;
  });

  // Monthly new customers
  const monthlyCustomers = MONTHS.map(month => ({ month, clientes: 0 }));
  newCustomersThisYear.forEach(u => {
    monthlyCustomers[new Date(u.createdAt).getMonth()].clientes += 1;
  });

  // Top products with names
  const productIds = topProductsRaw.map(p => p.productId);
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, title: true },
  });
  const nameMap = Object.fromEntries(productNames.map(p => [p.id, p.title]));

  const topProducts = topProductsRaw
    .map(p => ({
      name:     (nameMap[p.productId] ?? 'Producto').substring(0, 28),
      vendidos: p._sum.quantity ?? 0,
    }))
    .filter(p => p.vendidos > 0)
    .sort((a, b) => b.vendidos - a.vendidos);

  return {
    counts: {
      categories:   totalCategories,
      products:     totalProducts,
      orders:       totalOrders,
      customers:    totalCustomers,
      admins:       totalAdmins,
      totalRevenue: revenueAgg._sum.total ?? 0,
    },
    monthlyRevenue,
    monthlyCustomers,
    topProducts,
  };
}
