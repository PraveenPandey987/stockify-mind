
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StockData } from './StockCard';
import PortfolioOverview from './portfolio/PortfolioOverview';
import PortfolioHoldings from './portfolio/PortfolioHoldings';
import PortfolioHistory from './portfolio/PortfolioHistory';

export interface PortfolioHolding {
  stockId: string;
  quantity: number;
  averagePrice: number;
  stock: StockData;
}

export interface PortfolioData {
  balance: number;
  holdings: PortfolioHolding[];
  history: {
    date: string;
    value: number;
  }[];
}

interface PortfolioProps {
  data: PortfolioData;
  onSell?: (stock: StockData) => void;
  onBuy?: (stock: StockData) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ data, onSell, onBuy }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <PortfolioOverview data={data} />
        </TabsContent>
        
        <TabsContent value="holdings" className="animate-fade-in">
          <PortfolioHoldings data={data} onBuy={onBuy} onSell={onSell} />
        </TabsContent>
        
        <TabsContent value="history" className="animate-fade-in">
          <PortfolioHistory data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portfolio;
