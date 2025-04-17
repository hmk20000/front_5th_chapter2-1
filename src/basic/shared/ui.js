import { createElement } from './util';
import { strings } from './strings';
import { products } from './mockData';

/**
 * 메인 레이아웃 생성 함수
 * @param {Element} $root 루트 엘레멘트
 */
export const createMainLayout = ($root) => {
  const $mainContainer = createElement('div', {
    className: 'bg-gray-100 p-8',
    parent: $root,
  });
  const $contentWrapper = createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    parent: $mainContainer,
  });

  // 아래는 모두 $contentWrapper의 자식 요소
  createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: strings.cart,
    parent: $contentWrapper,
  });
  createElement('div', {
    id: 'cart-items',
    parent: $contentWrapper,
  });
  createElement('div', {
    className: 'text-xl font-bold my-4',
    id: 'cart-total',
    parent: $contentWrapper,
  });
  createElement('select', {
    className: 'border rounded p-2 mr-2',
    id: 'product-select',
    parent: $contentWrapper,
  });
  createElement('button', {
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    id: 'add-to-cart',
    textContent: strings.addToCart,
    parent: $contentWrapper,
  });
  createElement('div', {
    className: 'text-sm text-gray-500 mt-2',
    id: 'stock-status',
    parent: $contentWrapper,
  });
};

/**
 * 장바구니 아이템 생성 함수
 * @param {Object} product 상품 정보
 */
export const createCartItem = (product) => {
  const $cartList = document.getElementById('cart-items');
  const $newItem = createElement('div', {
    id: product.id,
    className: 'flex justify-between items-center mb-2',
    parent: $cartList,
  });

  createElement('span', {
    textContent: strings.cartItem(product.name, product.price, 1),
    parent: $newItem,
  });

  const $buttonGroup = createElement('div', {
    parent: $newItem,
  });

  const BUTTON_CLASS = 'text-white px-2 py-1 rounded';

  // 감소 버튼
  createElement('button', {
    className: `quantity-change bg-blue-500 ${BUTTON_CLASS} mr-1`,
    parent: $buttonGroup,
    textContent: '-',
    dataset: {
      productId: product.id,
      change: -1,
    },
  });

  // 증가 버튼
  createElement('button', {
    className: `quantity-change bg-blue-500 ${BUTTON_CLASS} mr-1`,
    parent: $buttonGroup,
    textContent: '+',
    dataset: {
      productId: product.id,
      change: 1,
    },
  });

  // 삭제 버튼
  createElement('button', {
    className: `remove-item bg-red-500 ${BUTTON_CLASS}`,
    parent: $buttonGroup,
    textContent: strings.removeItem,
    dataset: {
      productId: product.id,
    },
  });
};

/**
 * 상품 옵션 업데이트 함수
 * @param {Array} products 상품 정보
 */
export const renderProductOptions = (products) => {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = '';

  products.forEach((product) => {
    createElement('option', {
      value: product.id,
      textContent: product.name + ' - ' + product.price + '원',
      parent: $productSelect,
      disabled: product.quantity === 0,
    });
  });
};

/**
 * 장바구니 총액 업데이트 함수
 * @param {number} discountRate 할인율
 * @param {number} totalPrice 총액
 */
export const renderCartTotal = (discountRate, totalPrice) => {
  const $totalPrice = document.getElementById('cart-total');
  $totalPrice.textContent = strings.totalPrice(Math.round(totalPrice));
  if (discountRate > 0) {
    createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: strings.discountRate((discountRate * 100).toFixed(1)),
      parent: $totalPrice,
    });
  }
  renderStockStatus(products);
  renderPoints($totalPrice, totalPrice);
};

/**
 * 포인트 렌더링 함수
 * @param {Element} $totalPrice 총액 엘레멘트
 * @param {number} totalPrice 총액
 */
export const renderPoints = ($totalPrice, totalPrice) => {
  let points = Math.floor(totalPrice / 1000);
  let $point = document.getElementById('loyalty-points');
  if (!$point) {
    $point = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
      parent: $totalPrice,
    });
  }
  $point.textContent = strings.points(points);
};

/**
 * 재고 상태 표시 함수
 * @param {Element} $stockStatusList 재고 상태 표시 엘레멘트
 * @param {Array} products 상품 정보
 */
export const renderStockStatus = (products) => {
  const $stockStatusList = document.getElementById('stock-status');
  let stockStatusMessage = '';
  products.forEach((item) => {
    if (item.quantity < 5) {
      stockStatusMessage += strings.stockStatus(item.name, item.quantity);
    }
  });
  $stockStatusList.textContent = stockStatusMessage;
};
