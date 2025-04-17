import { cartStore } from '../store/cartStore';
import { strings } from '../../../basic/shared/strings';
const CartItem = () => {
  const { cartItems } = cartStore.useStore();
  const BUTTON_CLASS = 'text-white px-2 py-1 rounded';
  return (
    <div id="cart-items">
      {cartItems.map((item) => (
        <div
          key={item.product.id}
          className="flex justify-between items-center mb-2"
        >
          <span>
            {strings.cartItem(
              item.product.name,
              item.product.price,
              item.quantity,
            )}
          </span>
          <div>
            <button
              className={`quantity-change bg-blue-500 ${BUTTON_CLASS} mr-1`}
              onClick={() => {
                cartStore.getState().addCartProduct(item.product);
              }}
            >
              +
            </button>
            <button
              className={`quantity-change bg-blue-500 ${BUTTON_CLASS} mr-1`}
              onClick={() => {
                cartStore.getState().minusCartProduct(item.product);
              }}
            >
              -
            </button>
            <button
              className={`remove-item bg-red-500 ${BUTTON_CLASS} mr-1`}
              onClick={() => {
                cartStore.getState().removeCartProduct(item.product);
              }}
            >
              {strings.removeItem}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
