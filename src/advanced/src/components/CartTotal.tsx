import { strings } from '../../../basic/shared/strings';
import useCart from '../hooks/useCart';

const CartTotal = () => {
  const { totalPrice, discountRate } = useCart();
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {strings.totalPrice(Math.round(totalPrice))}
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          {strings.discountRate((discountRate * 100).toFixed(1))}
        </span>
      )}

      <span id="loyalty-points" className="text-blue-500 ml-2">
        {strings.points(Math.floor(totalPrice / 1000))}
      </span>
    </div>
  );
};

export default CartTotal;
