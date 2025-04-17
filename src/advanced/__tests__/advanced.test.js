import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCart from '../src/hooks/useCart';
import { cartStore } from '../src/store/cartStore';
import { createSale } from '../src/features/sale/createSale';
import { productStore } from '../src/store/productStore';
import { NUMBER } from '../../basic/shared/strings';

describe('useCart 훅 테스트', () => {
  beforeEach(() => {
    cartStore.setState({ cartItems: [] });
  });

  it('총 가격과 할인율이 올바르게 계산되어야 한다', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      cartStore.setState({
        cartItems: [
          {
            product: { price: 1000, discountRate: 0.1 },
            quantity: 5,
          },
          {
            product: { price: 2000, discountRate: 0.2 },
            quantity: 3,
          },
        ],
      });
    });

    expect(result.current.totalPrice).toBe(11000);
    expect(result.current.discountRate).toBe(0);
  });

  it('총 수량이 30개 이상일 때 대량 할인이 적용되어야 한다', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      cartStore.setState({
        cartItems: [
          {
            product: { price: 1000, discountRate: 0.1 },
            quantity: 20,
          },
          {
            product: { price: 2000, discountRate: 0.2 },
            quantity: 10,
          },
        ],
      });
    });

    expect(result.current.totalPrice).toBe(30000);
    expect(result.current.discountRate).toBe(0.25);
  });

  it('화요일에는 추가 할인이 적용되어야 한다', () => {
    const mockDate = new Date('2025-04-15'); // 화요일
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    const { result } = renderHook(() => useCart());

    act(() => {
      cartStore.setState({
        cartItems: [
          {
            product: { price: 1000, discountRate: 0 },
            quantity: 1,
          },
        ],
      });
    });

    expect(result.current.totalPrice).toBe(900);
    expect(result.current.discountRate).toBe(0.1);
  });
});

describe('createSale 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    productStore.setState({
      products: [
        { id: 1, name: '상품1', price: 1000, quantity: 10 },
        { id: 2, name: '상품2', price: 2000, quantity: 5 },
      ],
      selectedProduct: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('행운의 세일이 정상적으로 동작해야 한다', () => {
    const sale = createSale();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { products: initialProducts } = productStore.getState();
    const originalPrices = initialProducts.map((p) => ({
      id: p.id,
      price: p.price,
    }));

    // Math.random을 0.3 미만으로 고정하여 세일이 발생하도록 함
    vi.spyOn(Math, 'random').mockReturnValue(0.2);

    sale.start();
    // 랜덤 시작 시간 + 30초 진행
    vi.advanceTimersByTime(
      10000 + NUMBER.TICK_TIME * NUMBER.LUCKY_SALE_INTERVAL,
    );

    const { products } = productStore.getState();
    const discountedProduct = products.find((p) => {
      const originalPrice = originalPrices.find((op) => op.id === p.id)?.price;
      if (!originalPrice) return false;

      // 할인된 가격이 원래 가격의 80%인지 확인
      const expectedDiscountedPrice = Math.round(
        originalPrice * NUMBER.LUCKY_SALE_DISCOUNT_RATE,
      );
      return p.price === expectedDiscountedPrice;
    });

    expect(discountedProduct).toBeDefined();
    expect(alertSpy).toHaveBeenCalled();
  });

  it('추천 세일이 정상적으로 동작해야 한다', () => {
    const sale = createSale();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // 선택된 상품 설정
    productStore.setState({
      ...productStore.getState(),
      selectedProduct: { id: 1, name: '상품1', price: 1000, quantity: 10 },
    });

    sale.start();
    vi.advanceTimersByTime(
      10000 + NUMBER.TICK_TIME * NUMBER.SUGGEST_SALE_INTERVAL,
    );

    const { products } = productStore.getState();
    const discountedProduct = products.find(
      (p) => p.id !== 1 && p.price < 2000 * p.quantity,
    );

    expect(discountedProduct).toBeDefined();
    expect(alertSpy).toHaveBeenCalled();
  });

  it('세일이 중지되어야 한다', () => {
    const sale = createSale();
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    sale.start();
    sale.stop();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
