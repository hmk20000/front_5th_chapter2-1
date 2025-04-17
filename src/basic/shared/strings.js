export const strings = {
  cart: '장바구니',
  addToCart: '추가',
  removeItem: '삭제',
  luckySale: (productName) =>
    `번개세일! ${productName}이(가) 20% 할인 중입니다!`,
  suggestSale: (productName) =>
    `${productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
  totalPrice: (price) => `총액: ${price}원`,
  discountRate: (rate) => `(${rate}% 할인 적용)`,
  points: (points) => `(포인트: ${points})`,
  stockStatus: (productName, quantity) =>
    `${productName}: ${
      quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'
    }\n`,
  cartItem: (productName, price, quantity) =>
    `${productName} - ${price}원 x ${quantity}`,
  outOfStock: '재고가 부족합니다.',
  error: {
    tagNameRequired: 'tagName is required',
  },
};

export const NUMBER = {
  TICK_TIME: 1000,
  LUCKY_SALE_START: 10,
  SUGGEST_SALE_START: 20,
  LUCKY_SALE_INTERVAL: 30,
  SUGGEST_SALE_INTERVAL: 60,
  LUCKY_SALE_RATE: 0.3, // 번개세일 확률
  LUCKY_SALE_DISCOUNT_RATE: 0.8, // 번개세일 할인율
  SUGGEST_SALE_DISCOUNT_RATE: 0.95, // 추천세일 할인율
};
