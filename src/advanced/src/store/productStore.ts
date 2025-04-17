import { create } from './createStore';
import { ProductType } from '../types/types';
import { products } from '../../../basic/shared/mockData';

export const productStore = create<{
  products: ProductType[];
  selectedProduct: ProductType | null;
  updateProduct: (product: ProductType) => void;
  setSelectedProduct: (product: ProductType) => void;
}>({
  products: products,
  selectedProduct: null,
  updateProduct: (product: ProductType) => {
    productStore.setState({
      products: productStore
        .getState()
        .products.map((p) => (p.id === product.id ? product : p)),
    });
  },
  setSelectedProduct: (product: ProductType) => {
    productStore.setState({ selectedProduct: product });
  },
});
