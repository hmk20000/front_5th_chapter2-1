import { strings } from './shared/strings';
var lastSelectedProductId;

var products = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

/**
 * 엘레멘트 생성 함수
 * @param {string} tagName 태그 이름
 * @param {Object} options 옵션
 * @returns {Element} 생성된 엘레멘트
 */
function createElement(tagName, options) {
  if (!tagName) throw new Error(strings.error.tagNameRequired);
  const element = document.createElement(tagName);

  const { parent, ...rest } = options;
  Object.entries(rest).forEach(([key, value]) => {
    if (key === 'dataset') {
      Object.entries(value).forEach(([datasetKey, datasetValue]) => {
        element.dataset[datasetKey] = datasetValue;
      });
    } else {
      element[key] = value;
    }
  });
  if (parent) parent.appendChild(element);

  return element;
}

/**
 * 메인 레이아웃 생성 함수
 * @param {Element} $root 루트 엘레멘트
 */
function createMainLayout($root) {
  let $mainContainer = createElement('div', {
    className: 'bg-gray-100 p-8',
    parent: $root,
  });
  let $contentWrapper = createElement('div', {
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
}

/**
 * 장바구니 아이템 생성 함수
 * @param {Object} product 상품 정보
 */
function createCartItem(product) {
  const $cartList = document.getElementById('cart-items');
  var $newItem = createElement('div', {
    id: product.id,
    className: 'flex justify-between items-center mb-2',
    parent: $cartList,
  });

  createElement('span', {
    textContent: strings.cartItem(product.name, product.price, 1),
    parent: $newItem,
  });

  var $buttonGroup = createElement('div', {
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
}

function main() {
  createMainLayout(document.getElementById('app'));
  updateProductOptions(products);
  calculateCartTotal(products);

  const $addCart = document.getElementById('add-to-cart');
  $addCart.addEventListener('click', handleAddCart);

  const $cartList = document.getElementById('cart-items');
  $cartList.addEventListener('click', handleCartItemClick);

  setTimeout(function () {
    setInterval(function () {
      var luckyProduct = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * 0.8);
        alert(strings.luckySale(luckyProduct.name));
        updateProductOptions(products);
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProductId) {
        var suggest = products.find(function (product) {
          return product.id !== lastSelectedProductId && product.quantity > 0;
        });
        if (suggest) {
          alert(strings.suggestSale(suggest.name));
          suggest.price = Math.round(suggest.price * 0.95);
          updateProductOptions(suggest);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * 상품 옵션 업데이트 함수
 * @param {Array} products 상품 정보
 */
function updateProductOptions(products) {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = '';

  products.forEach(function (product) {
    createElement('option', {
      value: product.id,
      textContent: product.name + ' - ' + product.price + '원',
      parent: $productSelect,
      disabled: product.quantity === 0,
    });
  });
}

/**
 * 장바구니 총액 계산 함수
 * @param {Array} products 상품 정보
 */
function calculateCartTotal(products) {
  const $cartList = document.getElementById('cart-items');
  const $totalPrice = document.getElementById('cart-total');

  var totalPrice = 0;
  var totalCartQuantity = 0;
  // UI 요소이기 때문에 cartProducts가 아닌 cartItems로 설정
  var $cartItems = $cartList.children;
  var subtotal = 0;
  for (var i = 0; i < $cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === $cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }
      var quantity = parseInt(
        $cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      var originPrice = curItem.price * quantity;
      var discountRate = 0;
      totalCartQuantity += quantity;
      subtotal += originPrice;
      if (quantity >= 10) {
        if (curItem.id === 'p1') discountRate = 0.1;
        else if (curItem.id === 'p2') discountRate = 0.15;
        else if (curItem.id === 'p3') discountRate = 0.2;
        else if (curItem.id === 'p4') discountRate = 0.05;
        else if (curItem.id === 'p5') discountRate = 0.25;
      }
      totalPrice += originPrice * (1 - discountRate);
    })();
  }
  let discountRate = 0;
  if (totalCartQuantity >= 30) {
    var bulkDiscount = totalPrice * 0.25;
    var itemDiscount = subtotal - totalPrice;
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
  $totalPrice.textContent = strings.totalPrice(Math.round(totalPrice));
  if (discountRate > 0) {
    createElement('span', {
      className: 'text-green-500 ml-2',
      // textContent: '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)',
      textContent: strings.discountRate((discountRate * 100).toFixed(1)),
      parent: $totalPrice,
    });
  }
  updateStockStatusDisplay(products);
  renderPoints($totalPrice, totalPrice);
}

/**
 * 포인트 렌더링 함수
 * @param {Element} $totalPrice 총액 엘레멘트
 * @param {number} totalPrice 총액
 */
const renderPoints = ($totalPrice, totalPrice) => {
  let points = Math.floor(totalPrice / 1000);
  var $point = document.getElementById('loyalty-points');
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
function updateStockStatusDisplay(products) {
  const $stockStatusList = document.getElementById('stock-status');
  var stockStatusMessage = '';
  products.forEach(function (item) {
    if (item.quantity < 5) {
      stockStatusMessage += strings.stockStatus(item.name, item.quantity);
    }
  });
  $stockStatusList.textContent = stockStatusMessage;
}

/**
 * 추가 버튼 클릭 이벤트 핸들러
 */
function handleAddCart() {
  const $productSelect = document.getElementById('product-select');

  var selectedProductId = $productSelect.value;
  var selectedProduct = products.find(function (p) {
    return p.id === selectedProductId;
  });
  if (selectedProduct && selectedProduct.quantity > 0) {
    var $cartItem = document.getElementById(selectedProduct.id);
    if ($cartItem) {
      var newQuantity =
        parseInt($cartItem.querySelector('span').textContent.split('x ')[1]) +
        1;
      if (newQuantity <= selectedProduct.quantity) {
        $cartItem.querySelector('span').textContent = strings.cartItem(
          selectedProduct.name,
          selectedProduct.price,
          newQuantity
        );
        selectedProduct.quantity--;
      } else {
        alert(strings.outOfStock);
      }
    } else {
      createCartItem(selectedProduct);
      selectedProduct.quantity--;
    }
    calculateCartTotal(products);
    lastSelectedProductId = selectedProductId;
  }
}

/**
 * 장바구니 아이템 클릭 이벤트 핸들러
 */
function handleCartItemClick(event) {
  var $target = event.target;
  if (
    $target.classList.contains('quantity-change') ||
    $target.classList.contains('remove-item')
  ) {
    var productId = $target.dataset.productId;
    var $item = document.getElementById(productId);
    var product = products.find(function (p) {
      return p.id === productId;
    });
    if ($target.classList.contains('quantity-change')) {
      var quantityChange = parseInt($target.dataset.change);
      var newQuantity =
        parseInt($item.querySelector('span').textContent.split('x ')[1]) +
        quantityChange;
      if (
        newQuantity > 0 &&
        newQuantity <=
          product.quantity +
            parseInt($item.querySelector('span').textContent.split('x ')[1])
      ) {
        $item.querySelector('span').textContent =
          $item.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        $item.remove();
        product.quantity -= quantityChange;
      } else {
        alert(strings.outOfStock);
      }
    } else if ($target.classList.contains('remove-item')) {
      var removedQuantity = parseInt(
        $item.querySelector('span').textContent.split('x ')[1]
      );
      product.quantity += removedQuantity;
      $item.remove();
    }
    calculateCartTotal(products);
  }
}

main();
