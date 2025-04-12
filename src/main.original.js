var $productSelect, $addCart, $cartList, $totalPrice, $stockStatusList;
var lastSelectedProductId,
  points = 0,
  totalPrice = 0,
  totalCartQuantity = 0;
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
  if (!tagName) throw new Error('tagName is required');
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
    textContent: '장바구니',
    parent: $contentWrapper,
  });
  $cartList = createElement('div', {
    id: 'cart-items',
    parent: $contentWrapper,
  });
  $totalPrice = createElement('div', {
    className: 'text-xl font-bold my-4',
    id: 'cart-total',
    parent: $contentWrapper,
  });
  $productSelect = createElement('select', {
    className: 'border rounded p-2 mr-2',
    id: 'product-select',
    parent: $contentWrapper,
  });
  $addCart = createElement('button', {
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    id: 'add-to-cart',
    textContent: '추가',
    parent: $contentWrapper,
  });
  $stockStatusList = createElement('div', {
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
  var $newItem = createElement('div', {
    id: product.id,
    className: 'flex justify-between items-center mb-2',
    parent: $cartList,
  });

  createElement('span', {
    textContent: `${product.name} - ${product.price}원 x 1`,
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
    textContent: '삭제',
    dataset: {
      productId: product.id,
    },
  });
}

function main() {
  createMainLayout(document.getElementById('app'));
  updateProductOptions();
  calculateCartTotal();

  setTimeout(function () {
    setInterval(function () {
      var luckyProduct = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
        luckyProduct.price = Math.round(luckyProduct.price * 0.8);
        alert('번개세일! ' + luckyProduct.name + '이(가) 20% 할인 중입니다!');
        updateProductOptions();
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
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * 상품 옵션 업데이트 함수
 */
function updateProductOptions() {
  $productSelect.innerHTML = '';
  products.forEach(function (product) {
    var opt = createElement('option', {
      value: product.id,
      textContent: product.name + ' - ' + product.price + '원',
      parent: $productSelect,
      disabled: product.quantity === 0,
    });
  });
}

/**
 * 장바구니 총액 계산 함수
 */
function calculateCartTotal() {
  totalPrice = 0;
  totalCartQuantity = 0;
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
  $totalPrice.textContent = '총액: ' + Math.round(totalPrice) + '원';
  if (discountRate > 0) {
    createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)',
      parent: $totalPrice,
    });
  }
  updateStockStatusDisplay();
  renderPoints();
}

/**
 * 포인트 렌더링 함수
 */
const renderPoints = () => {
  points = Math.floor(totalPrice / 1000);
  var $point = document.getElementById('loyalty-points');
  if (!$point) {
    $point = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
      parent: $totalPrice,
    });
  }
  $point.textContent = '(포인트: ' + points + ')';
};

/**
 * 재고 상태 표시 함수
 */
function updateStockStatusDisplay() {
  var stockStatusMessage = '';
  products.forEach(function (item) {
    if (item.quantity < 5) {
      stockStatusMessage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockStatusList.textContent = stockStatusMessage;
}

main();

/**
 * 추가 버튼 클릭 이벤트 핸들러
 */
$addCart.addEventListener('click', function () {
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
        $cartItem.querySelector('span').textContent =
          selectedProduct.name +
          ' - ' +
          selectedProduct.price +
          '원 x ' +
          newQuantity;
        selectedProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      createCartItem(selectedProduct);
      selectedProduct.quantity--;
    }
    calculateCartTotal();
    lastSelectedProductId = selectedProductId;
  }
});

/**
 * 장바구니 아이템 클릭 이벤트 핸들러
 */
$cartList.addEventListener('click', function (event) {
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
        alert('재고가 부족합니다.');
      }
    } else if ($target.classList.contains('remove-item')) {
      var removedQuantity = parseInt(
        $item.querySelector('span').textContent.split('x ')[1]
      );
      product.quantity += removedQuantity;
      $item.remove();
    }
    calculateCartTotal();
  }
});
