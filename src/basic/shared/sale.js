import { products } from './mockData';
import { store } from './store';
import { strings } from './strings';
import { renderProductOptions } from './ui';

export const luckySale = () => {
  var luckyProduct = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
    luckyProduct.price = Math.round(luckyProduct.price * 0.8);
    alert(strings.luckySale(luckyProduct.name));
    renderProductOptions(products);
  }
};

export const suggestSale = () => {
  if (store.lastSelectedProductId) {
    var suggest = products.find(function (product) {
      return product.id !== store.lastSelectedProductId && product.quantity > 0;
    });
    if (suggest) {
      alert(strings.suggestSale(suggest.name));
      suggest.price = Math.round(suggest.price * 0.95);
      renderProductOptions(suggest);
    }
  }
};

export const initSale = () => {
  const TICK_TIME = 1000;

  let tick = 0;

  const luckySaleStart = Math.random() * 10;
  const suggestSaleStart = Math.random() * 20;

  setInterval(() => {
    tick++;
    if (luckySaleStart < tick && tick % 30 === 0) {
      luckySale();
    }
    if (suggestSaleStart < tick && tick % 60 === 0) {
      suggestSale();
    }
  }, TICK_TIME);
};
