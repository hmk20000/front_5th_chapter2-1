import { useMemo } from 'react';
import { cartStore } from '../store/cartStore';

const useCart = () => {
  const { cartItems } = cartStore.useStore();

  return useMemo(() => {
    let totalPrice = 0;
    let discountRate = 0;
    let totalQuantity = 0;
    let subtotal = 0;
    for (const item of cartItems) {
      totalQuantity += item.quantity;
      const originPrice = item.product.price * item.quantity;
      subtotal += originPrice;

      const itemDiscountRate =
        item.quantity >= 10 ? item.product.discountRate : 0;
      totalPrice += originPrice * (1 - itemDiscountRate);
    }

    if (totalQuantity >= 30) {
      const bulkDiscount = totalPrice * 0.25;
      const itemDiscount = subtotal - totalPrice;
      if (bulkDiscount > itemDiscount) {
        totalPrice = subtotal * (1 - 0.25);
        discountRate = 0.25;
      } else {
        discountRate = (subtotal - totalPrice) / subtotal;
      }
    } else {
      discountRate = (subtotal - totalPrice) / subtotal;
    }

    if (new Date().getDay() === 2) {
      totalPrice *= 1 - 0.1;
      discountRate = Math.max(discountRate, 0.1);
    }

    return { totalPrice, discountRate };
  }, [cartItems]);
};

export default useCart;
