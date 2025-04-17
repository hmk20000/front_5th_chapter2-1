import { useEffect } from 'react';
import { createSale } from './createSale';

export const useSale = () => {
  const sale = createSale();

  useEffect(() => {
    sale.start();
    return () => sale.stop();
  }, []);

  return sale;
};
