import { products } from './mockData';
import { store } from './store';
import { strings, NUMBER } from './strings';
import { renderProductOptions } from './ui';

/**
 * 세일 초기화
 */
export const initSale = () => {
  let tick = 0;

  const luckySaleStart = Math.random() * 10;
  const suggestSaleStart = Math.random() * 20;

  setInterval(() => {
    tick++;
    if (luckySaleStart < tick && tick % NUMBER.LUCKY_SALE_INTERVAL === 0) {
      luckySale();
    }
    if (suggestSaleStart < tick && tick % NUMBER.SUGGEST_SALE_INTERVAL === 0) {
      suggestSale();
    }
  }, NUMBER.TICK_TIME);
};

/**
 * 번개세일 처리
 */
export const luckySale = () => {
  const luckyProduct = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < NUMBER.LUCKY_SALE_RATE && luckyProduct.quantity > 0) {
    luckyProduct.price = Math.round(
      luckyProduct.price * NUMBER.LUCKY_SALE_DISCOUNT_RATE,
    );
    alert(strings.luckySale(luckyProduct.name));
    renderProductOptions(products);
  }
};

/**
 * 추천세일 처리
 */
export const suggestSale = () => {
  if (!store.lastSelectedProductId) return;

  const suggest = products.find(
    (product) =>
      product.id !== store.lastSelectedProductId && product.quantity > 0,
  );

  if (!suggest) return;

  alert(strings.suggestSale(suggest.name));
  suggest.price = Math.round(suggest.price * NUMBER.SUGGEST_SALE_DISCOUNT_RATE);
  renderProductOptions(suggest);
};
