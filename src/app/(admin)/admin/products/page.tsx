import prisma from '@/lib/prisma';
import { ProductsClient } from './ui/ProductsClient';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { title: 'asc' },
      include: {
        images: { select: { id: true, url: true }, orderBy: { id: 'asc' } },
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  return <ProductsClient products={products} categories={categories} />;
}
