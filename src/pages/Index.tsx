
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import TradeModal from '@/components/TradeModal';
import { StockData } from '@/components/StockCard';
import { generateStocks, generateMarketData, generatePortfolioData, generateChartData } from '@/utils/stockData';
import { applyMLPredictions } from '@/utils/mlPredictions';
import { toast } from 'sonner';

const Index = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [marketData, setMarketData] = useState<any>({
    trendingStocks: [],
    topGainers: [],
    topLosers: [],
    indices: [],
    recentActivity: []
  });
  const [portfolioData, setPortfolioData] = useState<any>({
    balance: 10000,
    holdings: [],
    history: []
  });
  const [chartData, setChartData] = useState<any[]>([]);
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
    const initializeData = () => {
      setIsLoading(true);
      
      // Generate initial stocks
      let generatedStocks = generateStocks(30);
      
      // Apply ML predictions
      generatedStocks = applyMLPredictions(generatedStocks);
      
      // Generate market data
      const generatedMarketData = generateMarketData(generatedStocks);
      
      // Generate portfolio data
      const generatedPortfolioData = generatePortfolioData(generatedStocks);
      
      // Generate chart data
      const generatedChartData = generateChartData(30, 10000, 0.02);
      
      // Update state
      setStocks(generatedStocks);
      setMarketData(generatedMarketData);
      setPortfolioData(generatedPortfolioData);
      setChartData(generatedChartData);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    };
    
    initializeData();
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
  
  // Handle viewing a stock
  const handleView = (stock: StockData) => {
    toast.info(`Viewing ${stock.symbol}`, {
      description: `Current price: $${stock.price.toFixed(2)}`,
    });
  };
  
  // Handle trade completion
  const handleTrade = (stockId: string, amount: number, totalPrice: number) => {
    // Find stock
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;
    
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
      } else {
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
    
    // Update activity
    const newActivity = {
      id: `activity-${Date.now()}`,
      type: amount > 0 ? 'buy' : 'sell',
      stockSymbol: stock.symbol,
      quantity: Math.abs(amount),
      price: stock.price,
      date: today
    };
    
    const newMarketData = { ...marketData };
    newMarketData.recentActivity = [newActivity, ...newMarketData.recentActivity.slice(0, 4)];
    
    // Update state
    setPortfolioData(newPortfolioData);
    setMarketData(newMarketData);
  };
  
  return (
    <Layout>
      {isLoading ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </div>
      ) : (
        <Dashboard 
          marketData={marketData}
          portfolioData={portfolioData}
          chartData={chartData}
          onBuy={handleBuy}
          onSell={handleSell}
          onView={handleView}
        />
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

export default Index;
