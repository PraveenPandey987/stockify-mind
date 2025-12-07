
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Portfolio from '@/components/Portfolio'; 
import TradeModal from '@/components/TradeModal';
import { StockData } from '@/components/StockCard';
import { generateStocks, generatePortfolioData } from '@/utils/stockData';
import { applyMLPredictions } from '@/utils/mlPredictions';
import { toast } from 'sonner';

const PortfolioPage = () => {
  const [portfolioData, setPortfolioData] = useState<any>({
    balance: 10000,
    holdings: [],
    history: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Trade modal state
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    stock: StockData | null;
    type: 'buy' | 'sell';
  }>({
    isOpen: false,
    stock: null,
    type: 'buy'
  });
  
  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate stocks
      let generatedStocks = generateStocks(30);
      
      // Apply ML predictions
      generatedStocks = applyMLPredictions(generatedStocks);
      
      // Generate portfolio data
      const generatedPortfolioData = generatePortfolioData(generatedStocks);
      
      setPortfolioData(generatedPortfolioData);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    loadData();
  }, []);
  
  // Handle buying a stock
  const handleBuy = (stock: StockData) => {
    setTradeModal({
      isOpen: true,
      stock,
      type: 'buy'
    });
  };
  
  // Handle selling a stock
  const handleSell = (stock: StockData) => {
    setTradeModal({
      isOpen: true,
      stock,
      type: 'sell'
    });
  };
  
  // Handle trade completion
  const handleTrade = (stockId: string, amount: number, totalPrice: number) => {
    // Find stock
    const stock = portfolioData.holdings.find((h: any) => h.stockId === stockId)?.stock;
    if (!stock && amount > 0) return; // Can't buy a stock not found in data
    
    // Clone portfolio data
    const newPortfolioData = { ...portfolioData };
    
    if (amount > 0) {
      // This is a buy order
      // Deduct balance
      newPortfolioData.balance -= totalPrice;
      
      // Find if stock is already in holdings
      const existingHolding = newPortfolioData.holdings.find(
        (h: any) => h.stockId === stockId
      );
      
      if (existingHolding) {
        // Update existing holding
        const totalShares = existingHolding.quantity + amount;
        const totalCost = existingHolding.averagePrice * existingHolding.quantity + totalPrice;
        existingHolding.quantity = totalShares;
        existingHolding.averagePrice = totalCost / totalShares;
      } else if (stock) {
        // Add new holding
        newPortfolioData.holdings.push({
          stockId,
          quantity: amount,
          averagePrice: stock.price,
          stock
        });
      }
    } else {
      // This is a sell order
      // Add to balance (amount is negative)
      newPortfolioData.balance -= totalPrice;
      
      // Find holding
      const existingHoldingIndex = newPortfolioData.holdings.findIndex(
        (h: any) => h.stockId === stockId
      );
      
      if (existingHoldingIndex !== -1) {
        const existingHolding = newPortfolioData.holdings[existingHoldingIndex];
        existingHolding.quantity += amount; // amount is negative
        
        // Remove holding if quantity is 0
        if (existingHolding.quantity <= 0) {
          newPortfolioData.holdings.splice(existingHoldingIndex, 1);
        }
      }
    }
    
    // Add to history
    const today = new Date().toISOString();
    const currentPortfolioValue = newPortfolioData.holdings.reduce(
      (sum: number, holding: any) => sum + holding.quantity * holding.stock.price,
      0
    ) + newPortfolioData.balance;
    
    newPortfolioData.history.push({
      date: today,
      value: currentPortfolioValue
    });
    
    // Update state
    setPortfolioData(newPortfolioData);
    
    toast.success(
      `${amount > 0 ? 'Bought' : 'Sold'} ${Math.abs(amount)} shares of ${stock.symbol}`,
      {
        description: `Total: $${Math.abs(totalPrice).toFixed(2)}`,
      }
    );
  };
  
  return (
    <Layout>
      {isLoading ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading portfolio data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold">Portfolio</h1>
          
          <Portfolio 
            data={portfolioData}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        </div>
      )}
      
      <TradeModal
        stock={tradeModal.stock}
        type={tradeModal.type}
        balance={portfolioData.balance}
        owned={tradeModal.stock 
          ? (portfolioData.holdings.find((h: any) => h.stockId === tradeModal.stock?.id)?.quantity || 0)
          : 0
        }
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal({ ...tradeModal, isOpen: false })}
        onTrade={handleTrade}
      />
    </Layout>
  );
};

export default PortfolioPage;
