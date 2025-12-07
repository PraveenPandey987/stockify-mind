
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MLPrediction from '@/components/MLPrediction';
import TradeModal from '@/components/TradeModal';
import { StockData } from '@/components/StockCard';
import { generateStocks } from '@/utils/stockData';
import { applyMLPredictions } from '@/utils/mlPredictions';
import { toast } from 'sonner';

const Predictions = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
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
      
      setStocks(generatedStocks);
      
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
  
  // Handle viewing a stock
  const handleView = (stock: StockData) => {
    toast.info(`Viewing ${stock.symbol}`, {
      description: `ML Prediction: $${stock.prediction?.nextDayPrice.toFixed(2)}`,
    });
  };
  
  // Handle trade completion
  const handleTrade = (stockId: string, amount: number, totalPrice: number) => {
    // Find stock
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;
    
    toast.success(
      `Successfully bought ${amount} shares of ${stock.symbol}`,
      {
        description: `Total: $${totalPrice.toFixed(2)}`,
      }
    );
  };
  
  return (
    <Layout>
      {isLoading ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ML predictions...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold">ML Predictions</h1>
          
          <MLPrediction 
            stocks={stocks}
            onBuy={handleBuy}
            onView={handleView}
          />
        </div>
      )}
      
      <TradeModal
        stock={tradeModal.stock}
        type={tradeModal.type}
        balance={10000} // Simulated balance
        owned={0} // Simulated owned shares
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal({ ...tradeModal, isOpen: false })}
        onTrade={handleTrade}
      />
    </Layout>
  );
};

export default Predictions;
