import React from 'react';
import { cartStore } from '../store/cartStore';
import { productStore } from '../store/productStore';

const ProductSelect = () => {
  const { products, selectedProduct, setSelectedProduct } =
    productStore.useStore();

  const { addCartProduct } = cartStore.getState();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = event.target.value;
    const product = products.find((product) => product.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addCartProduct(selectedProduct);
    }
  };

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={handleSelectChange}
        value={selectedProduct?.id}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCart}
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
