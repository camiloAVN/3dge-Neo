export interface VariantType {
  id: string;
  name: string;
  values?: VariantValue[];
}

export interface VariantValue {
  id: string;
  value: string;
  variantTypeId: string;
  variantType?: VariantType;
}

export interface ProductVariant {
  id: string;
  price: number | null;
  inStock: number;
  sku: string | null;
  productId: string;
  values?: ProductVariantValue[];
}

export interface ProductVariantValue {
  productVariantId: string;
  variantValueId: string;
  variantValue?: VariantValue;
}
