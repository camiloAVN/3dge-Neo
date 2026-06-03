import { Category } from './category.interface';
import { ProductVariant } from './variant.interface';

export interface Product {
  id: string;
  title: string;
  description: string;
  inStock: number;
  price: number;
  slug: string;
  tags: string[];
  images: string[];
  categoryId: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
  variantLabel?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}
