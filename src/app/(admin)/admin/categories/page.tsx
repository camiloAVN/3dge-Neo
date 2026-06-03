import prisma from '@/lib/prisma';
import { CategoriesClient } from './ui/CategoriesClient';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return <CategoriesClient categories={categories} />;
}
