import { createMainLayout, renderProductOptions } from './shared/ui';
import { products } from './shared/mockData';
import { initSale } from './shared/sale';
import {
  calculateCartTotal,
  handleAddCart,
  handleCartItemClick,
} from './shared/cart';

(() => {
  createMainLayout(document.getElementById('app'));
  renderProductOptions(products);
  calculateCartTotal(products);

  initSale();

  const $addCart = document.getElementById('add-to-cart');
  $addCart.addEventListener('click', handleAddCart);

  const $cartList = document.getElementById('cart-items');
  $cartList.addEventListener('click', handleCartItemClick);
})();
