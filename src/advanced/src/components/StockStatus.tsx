import { strings } from '../../../basic/shared/strings';
import { productStore } from '../store/productStore';

const StockStatus = () => {
  const { products } = productStore.getState();
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {products.map(
        (product) =>
          product.quantity < 5 &&
          strings.stockStatus(product.name, product.quantity),
      )}
    </div>
  );
};

export default StockStatus;
