import { initialData } from './seed';
import prisma from '../lib/prisma';
import { countries } from './seed-countries';

async function main() {

  // Limpiar en orden para respetar foreign keys
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariantValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.variantValue.deleteMany();
  await prisma.variantType.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products, users } = initialData;

  // Usuarios
  await prisma.user.createMany({ data: users });

  // Países
  await prisma.country.createMany({ data: countries });

  // Categorías
  await prisma.category.createMany({ data: categories });

  const categoriesDB = await prisma.category.findMany();
  const categoryMap = categoriesDB.reduce((map, cat) => {
    map[cat.slug] = cat.id;
    return map;
  }, {} as Record<string, string>);

  // Productos
  for (const product of products) {
    const { images, categorySlug, ...rest } = product;

    const categoryId = categoryMap[categorySlug];
    if (!categoryId) {
      console.warn(`Categoría no encontrada: ${categorySlug}`);
      continue;
    }

    const dbProduct = await prisma.product.create({
      data: { ...rest, categoryId },
    });

    await prisma.productImage.createMany({
      data: images.map(url => ({ url, productId: dbProduct.id })),
    });
  }

  console.log('Seed ejecutado correctamente');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();
