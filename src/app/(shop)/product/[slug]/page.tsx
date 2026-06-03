export const revalidate = 604800;

import notFound from '../not-found';
import { titleFont } from '@/config/fonts';
import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from '@/components';
import { getProductBySlug } from '@/actions';
import { currencyFormat } from '@/utils';
import { Metadata, ResolvingMetadata } from 'next';
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        <ProductMobileSlideShow
          title={product!.title}
          images={product!.images}
          className="block md:hidden"
        />
        <ProductSlideShow
          title={product!.title}
          images={product!.images}
          className="hidden md:block"
        />
      </div>

      {/* Info panel */}
      <div className="col-span-1 p-6 bg-white rounded-lg border border-[#E5E5E5] h-fit mb-5">

        <StockLabel slug={product!.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-2xl text-[#111111] leading-tight mb-2`}>
          {product!.title}
        </h1>

        <p className="text-2xl font-bold text-[#111111] mb-5">
          {currencyFormat(product!.price)}
        </p>

        <AddToCart product={product!} />

        <hr className="border-[#E5E5E5] my-5" />

        <div>
          <h3 className="text-xs font-semibold text-[#444444] uppercase tracking-wider mb-2">
            Descripción
          </h3>
          <p className="text-sm text-[#444444] leading-relaxed">
            {product!.description}
          </p>
        </div>

      </div>
    </div>
  );
}
