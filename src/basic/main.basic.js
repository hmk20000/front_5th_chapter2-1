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
  const $cartList = document.getElementById('cart-items');

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

  renderCartTotal(discountRate, totalPrice);
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
