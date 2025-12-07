
import { PortfolioHolding } from '../components/Portfolio';

export const calculateTotalValue = (holdings: PortfolioHolding[]): number => {
  return holdings.reduce((total, holding) => {
    return total + (holding.quantity * holding.stock.price);
  }, 0);
};

export const calculateTotalGainLoss = (holdings: PortfolioHolding[]): number => {
  return holdings.reduce((total, holding) => {
    const currentValue = holding.quantity * holding.stock.price;
    const costBasis = holding.quantity * holding.averagePrice;
    return total + (currentValue - costBasis);
  }, 0);
};

export const calculateGainLossPercent = (holdings: PortfolioHolding[]): number => {
  const totalCost = holdings.reduce((total, holding) => {
    return total + (holding.quantity * holding.averagePrice);
  }, 0);
  
  if (totalCost === 0) return 0;
  
  const totalValue = calculateTotalValue(holdings);
  return ((totalValue - totalCost) / totalCost) * 100;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

export const sortHoldingsByValue = (holdings: PortfolioHolding[]): PortfolioHolding[] => {
  return [...holdings].sort((a, b) => {
    const valueA = a.quantity * a.stock.price;
    const valueB = b.quantity * b.stock.price;
    return valueB - valueA;
  });
};
