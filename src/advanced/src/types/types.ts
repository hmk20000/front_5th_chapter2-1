export type ProductType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountRate: number;
};

export type CartItemType = {
  product: ProductType;
  quantity: number;
};
