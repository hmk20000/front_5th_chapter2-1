import { strings } from './shared/strings';
import {
  createMainLayout,
  createCartItem,
  renderProductOptions,
  renderCartTotal,
} from './shared/ui';
import { products } from './shared/mockData';

var lastSelectedProductId;

function main() {
  createMainLayout(document.getElementById('app'));
  renderProductOptions(products);
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
        renderProductOptions(products);
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
          renderProductOptions(suggest);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * 장바구니 총액 계산 함수
 * @param {Array} products 상품 정보
 */
function calculateCartTotal(products) {
  // 할인전 총액
  var subtotal = 0;
  // 할인후 총액
  var totalPrice = 0;
  // 총 수량
  var totalCartQuantity = 0;

  // UI 요소이기 때문에 cartProducts가 아닌 cartItems로 설정
  const $cartList = document.getElementById('cart-items');
  const $cartItems = $cartList.children;

  // 장바구니에 있는 각 상품에 대해 반복
  for (var i = 0; i < $cartItems.length; i++) {
    // 현재 상품의 정보를 products 배열에서 찾기
    const curItem = products.find((p) => p.id === $cartItems[i].id);

    // 상품의 수량을 파싱 (예: "상품명 x 2"에서 2를 추출)
    const quantity = parseInt(
      $cartItems[i].querySelector('span').textContent.split('x ')[1]
    );
    // 전체 수량 업데이트
    totalCartQuantity += quantity;

    // 원래 가격 계산 (상품 가격 * 수량)
    const originPrice = curItem.price * quantity;
    // 전체 합계 업데이트
    subtotal += originPrice;

    // 수량이 10개 이상이면 상품별 할인율 적용
    const itemDiscountRate = quantity >= 10 ? curItem.discountRate : 0;
    // 할인된 가격을 총액에 더하기
    totalPrice += originPrice * (1 - itemDiscountRate);
  }

  // 총 수량이 30개 이상이면 25% 할인
  var discountRate = 0;
  if (totalCartQuantity >= 30) {
    var bulkDiscount = totalPrice * 0.25;
    var itemDiscount = subtotal - totalPrice;
    // 총 할인액이 더 크면 총 할인액 적용
    if (bulkDiscount > itemDiscount) {
      totalPrice = subtotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      // 개별 할인액이 더 크면 개별 할인액 적용
      discountRate = (subtotal - totalPrice) / subtotal;
    }
  } else {
    // 총 수량이 30개 미만이면 개별 할인액 적용
    discountRate = (subtotal - totalPrice) / subtotal;
  }
  // 화요일이면 10% 할인
  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  renderCartTotal(discountRate, totalPrice);
}

/**
 * 추가 버튼 클릭 이벤트 핸들러
 */
function handleAddCart() {
  const $productSelect = document.getElementById('product-select');

  var selectedProductId = $productSelect.value;
  var selectedProduct = products.find((p) => p.id === selectedProductId);
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
    var product = products.find((p) => p.id === productId);
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
