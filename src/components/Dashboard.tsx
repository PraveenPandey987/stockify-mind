
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PortfolioData } from './Portfolio';
import { StockData } from './StockCard';
import StockCard from './StockCard';
import StockChart from './StockChart';
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  BadgeDollarSign,
  LineChart,
  BarChart4,
  Sparkles
} from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { Link } from 'react-router-dom';

interface DashboardProps {
  marketData: {
    trendingStocks: StockData[];
    topGainers: StockData[];
    topLosers: StockData[];
    indices: {
      name: string;
      value: number;
      change: number;
      changePercent: number;
    }[];
    recentActivity: {
      id: string;
      type: 'buy' | 'sell';
      stockSymbol: string;
      quantity: number;
      price: number;
      date: string;
    }[];
  };
  portfolioData: PortfolioData;
  chartData: {
    date: string;
    value: number;
  }[];
  onBuy?: (stock: StockData) => void;
  onSell?: (stock: StockData) => void;
  onView?: (stock: StockData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  marketData,
  portfolioData,
  chartData,
  onBuy,
  onSell,
  onView
}) => {
  const [marketTab, setMarketTab] = useState('trending');
  
  const totalPortfolioValue = portfolioData.holdings.reduce(
    (sum, holding) => sum + holding.stock.price * holding.quantity, 
    0
  ) + portfolioData.balance;
  
  const totalInvested = portfolioData.holdings.reduce(
    (sum, holding) => sum + holding.averagePrice * holding.quantity, 
    0
  );
  
  const totalGainLoss = portfolioData.holdings.reduce(
    (sum, holding) => {
      const gainLoss = (holding.stock.price - holding.averagePrice) * holding.quantity;
      return sum + gainLoss;
    }, 
    0
  );
  
  // Calculate overall market sentiment
  const marketSentiment = marketData.indices.reduce(
    (sum, index) => sum + (index.change > 0 ? 1 : -1), 
    0
  );
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Badge variant={marketSentiment > 0 ? "default" : "destructive"} className="px-2 py-1">
            {marketSentiment > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            Market: {marketSentiment > 0 ? "Bullish" : "Bearish"}
          </Badge>
        </div>
      </div>
      
      {/* Portfolio Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio Value</CardDescription>
            <CardTitle className="text-3xl">
              <AnimatedNumber value={totalPortfolioValue} prefix="$" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Cash: ${portfolioData.balance.toFixed(2)}
            </div>
            <Link to="/portfolio" className="text-sm text-primary flex items-center mt-2">
              View Portfolio <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today's Change</CardDescription>
            <CardTitle className={`text-3xl ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              <AnimatedNumber 
                value={totalGainLoss} 
                prefix={totalGainLoss >= 0 ? '+$' : '-$'} 
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalGainLoss >= 0 ? '+' : ''}
              {totalInvested > 0 
                ? (totalGainLoss / totalInvested * 100).toFixed(2) 
                : '0.00'
              }%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Owned Stocks</CardDescription>
            <CardTitle className="text-3xl">
              {portfolioData.holdings.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {portfolioData.holdings.reduce((total, holding) => total + holding.quantity, 0)} shares total
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Market Overview</CardTitle>
                <Link to="/market" className="text-sm text-primary flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={marketTab} onValueChange={setMarketTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                  <TabsTrigger value="losers">Top Losers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trending" className="animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {marketData.trendingStocks.slice(0, 4).map((stock) => (
                      <StockCard 
                        key={stock.id} 
                        stock={stock}
                        onBuy={onBuy}
                        onView={onView}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="gainers" className="animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {marketData.topGainers.slice(0, 4).map((stock) => (
                      <StockCard 
                        key={stock.id} 
                        stock={stock}
                        onBuy={onBuy}
                        onView={onView}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="losers" className="animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {marketData.topLosers.slice(0, 4).map((stock) => (
                      <StockCard 
                        key={stock.id} 
                        stock={stock}
                        onBuy={onBuy}
                        onView={onView}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Market Indices</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {marketData.indices.map((index, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="font-medium">{index.name}</span>
                    <div className="text-right">
                      <div className="font-medium">{index.value.toFixed(2)}</div>
                      <div className={`text-sm flex items-center justify-end ${
                        index.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {index.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/market">
                <Button variant="outline" className="w-full mt-4">
                  <LineChart className="h-4 w-4 mr-2" />
                  View All Market Data
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Chart and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <StockChart 
              data={chartData}
              isUp={totalGainLoss >= 0}
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {marketData.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {marketData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/50">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'buy' ? 'bg-success/20' : 'bg-destructive/20'
                    }`}>
                      <BadgeDollarSign className={`h-4 w-4 ${
                        activity.type === 'buy' ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {activity.type === 'buy' ? 'Bought' : 'Sold'} {activity.quantity} {activity.stockSymbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(activity.price * activity.quantity)} at {formatDate(activity.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            )}
            
            <div className="mt-4 space-y-2">
              <Link to="/portfolio">
                <Button variant="outline" className="w-full">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  View Portfolio
                </Button>
              </Link>
              <Link to="/predictions">
                <Button variant="outline" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  ML Predictions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
