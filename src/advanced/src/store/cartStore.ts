import { create } from './createStore';
import { CartItemType, ProductType } from '../types/types';

export const cartStore = create<{
  cartItems: CartItemType[];
  addCartProduct: (product: ProductType) => void;
  minusCartProduct: (product: ProductType) => void;
  removeCartProduct: (product: ProductType) => void;
}>({
  cartItems: [],

  addCartProduct: (product: ProductType) => {
    const { cartItems } = cartStore.getState();
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id,
    );
    cartStore.setState({
      cartItems: existingItem
        ? cartItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...cartItems, { product, quantity: 1 }],
    });
  },

  minusCartProduct: (product: ProductType) => {
    const { cartItems } = cartStore.getState();
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id,
    );
    if (!existingItem) return;

    if (existingItem.quantity === 1) {
      cartStore.getState().removeCartProduct(product);
    } else {
      cartStore.setState({
        cartItems: cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      });
    }
  },

  removeCartProduct: (product: ProductType) => {
    const { cartItems } = cartStore.getState();
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id,
    );
    if (existingItem) {
      cartStore.setState({
        cartItems: cartItems.filter((item) => item.product.id !== product.id),
      });
    }
  },
});
