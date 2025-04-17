import { products } from './mockData';
import { store } from './store';
import { strings } from './strings';
import { renderProductOptions } from './ui';

export const luckySale = () => {
  setTimeout(() => {
    setInterval(() => {
      var luckyProduct = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * 0.8);
        alert(strings.luckySale(luckyProduct.name));
        renderProductOptions(products);
      }
    }, 30000);
  }, Math.random() * 10000);
};

export const suggestSale = () => {
  setTimeout(function () {
    setInterval(function () {
      if (store.lastSelectedProductId) {
        var suggest = products.find(function (product) {
          return (
            product.id !== store.lastSelectedProductId && product.quantity > 0
          );
        });
        if (suggest) {
          alert(strings.suggestSale(suggest.name));
          suggest.price = Math.round(suggest.price * 0.95);
          renderProductOptions(suggest);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};
