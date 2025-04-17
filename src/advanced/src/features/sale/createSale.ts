import { NUMBER, strings } from '../../../../basic/shared/strings';
import { productStore } from '../../store/productStore';
export const createSale = () => {
  let intervalId: number | null = null;
  let tick = 0;
  const start = () => {
    // 랜덤 시작 시간 (0-10초)
    const luckySaleStart = Math.random() * 10;
    const suggestSaleStart = Math.random() * 20;

    intervalId = window.setInterval(() => {
      tick++;
      if (luckySaleStart < tick && tick % NUMBER.LUCKY_SALE_INTERVAL === 0) {
        luckySale();
      }
      if (
        suggestSaleStart < tick &&
        tick % NUMBER.SUGGEST_SALE_INTERVAL === 0
      ) {
        suggestSale();
      }
    }, NUMBER.TICK_TIME);
  };

  const luckySale = () => {
    const { products } = productStore.getState();
    const luckyProduct = products[Math.floor(Math.random() * products.length)];
    if (Math.random() < NUMBER.LUCKY_SALE_RATE && luckyProduct.quantity > 0) {
      luckyProduct.price = Math.round(
        luckyProduct.price * NUMBER.LUCKY_SALE_DISCOUNT_RATE,
      );
      alert(strings.luckySale(luckyProduct.name));
      productStore.setState({
        products: products.map((product) =>
          product.id === luckyProduct.id ? luckyProduct : product,
        ),
        selectedProduct: luckyProduct,
      });
    }
  };

  const suggestSale = () => {
    const { products, selectedProduct } = productStore.getState();
    if (!selectedProduct) return;

    const suggest = products.find(
      (product) => product.id !== selectedProduct.id && product.quantity > 0,
    );
    if (!suggest) return;

    suggest.price = Math.round(
      suggest.price * NUMBER.SUGGEST_SALE_DISCOUNT_RATE,
    );
    alert(strings.suggestSale(suggest.name));
    productStore.setState({
      products: products.map((product) =>
        product.id === suggest.id ? suggest : product,
      ),
      selectedProduct: suggest,
    });
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  return {
    start,
    stop,
  };
};
