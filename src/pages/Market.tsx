
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StockCard, { StockData } from '@/components/StockCard';
import StockChart, { ChartData } from '@/components/StockChart';
import TradeModal from '@/components/TradeModal';
import { 
  BarChart4, 
  LineChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';
import { generateStocks, getTopGainers, getTopLosers, getTrendingStocks, generateChartData } from '@/utils/stockData';
import { applyMLPredictions } from '@/utils/mlPredictions';

const Market = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<StockData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stockChartData, setStockChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
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
      let generatedStocks = generateStocks(50);
      
      // Apply ML predictions
      generatedStocks = applyMLPredictions(generatedStocks);
      
      // Get top gainers and losers
      const generatedTopGainers = getTopGainers(generatedStocks, 10);
      const generatedTopLosers = getTopLosers(generatedStocks, 10);
      const generatedTrendingStocks = getTrendingStocks(generatedStocks, 10);
      
      // Sort stocks by symbol
      generatedStocks.sort((a, b) => a.symbol.localeCompare(b.symbol));
      
      setStocks(generatedStocks);
      setFilteredStocks(generatedStocks);
      setTopGainers(generatedTopGainers);
      setTopLosers(generatedTopLosers);
      setTrendingStocks(generatedTrendingStocks);
      setSelectedStock(generatedStocks[0]);
      
      // Generate chart data for the first stock
      setStockChartData(generateChartData(90, generatedStocks[0].price, 0.03));
      
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    loadData();
  }, []);
  
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStocks(stocks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = stocks.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
      );
      setFilteredStocks(filtered);
    }
  }, [searchQuery, stocks]);
  
  // Handle stock selection
  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    
    // Generate new chart data for selected stock
    setStockChartData(generateChartData(90, stock.price, 0.03));
  };
  
  // Handle buying a stock
  const handleBuy = (stock: StockData) => {
    setTradeModal({
      isOpen: true,
      stock,
      type: 'buy'
    });
  };
  
  // Handle trade completion
  const handleTrade = (stockId: string, amount: number, totalPrice: number) => {
    // In a real app, this would update the user's portfolio
    console.log(`Traded ${amount} shares for $${totalPrice}`);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Market</h1>
          
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px] md:w-[300px]"
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Stocks</TabsTrigger>
                <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                <TabsTrigger value="losers">Top Losers</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="animate-fade-in">
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading stocks...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStocks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStocks.map((stock) => (
                          <StockCard 
                            key={stock.id} 
                            stock={stock}
                            onBuy={() => handleBuy(stock)}
                            onView={() => handleSelectStock(stock)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-lg font-medium">No stocks found</p>
                        <p className="text-muted-foreground">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="gainers" className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUpRight className="h-5 w-5 text-success" />
                  <h2 className="text-xl font-medium">Top Gainers</h2>
                </div>
                
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading top gainers...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topGainers.map((stock) => (
                      <StockCard 
                        key={stock.id} 
                        stock={stock}
                        onBuy={() => handleBuy(stock)}
                        onView={() => handleSelectStock(stock)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="losers" className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                  <h2 className="text-xl font-medium">Top Losers</h2>
                </div>
                
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading top losers...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topLosers.map((stock) => (
                      <StockCard 
                        key={stock.id} 
                        stock={stock}
                        onBuy={() => handleBuy(stock)}
                        onView={() => handleSelectStock(stock)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="trending" className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart4 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">Trending Stocks</h2>
                </div>
                
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-t-primary border-primary/20 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading trending stocks...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingStocks.map((stock) => (
                      <StockCard 
                        key={stock.id} 
                        stock={stock}
                        onBuy={() => handleBuy(stock)}
                        onView={() => handleSelectStock(stock)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="order-1 lg:order-2">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedStock ? (
                    <div>
                      <span>{selectedStock.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-2">{selectedStock.name}</span>
                    </div>
                  ) : (
                    <span>Select a Stock</span>
                  )}
                  
                  {selectedStock && (
                    <div className={`text-sm ${selectedStock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {selectedStock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                      )}
                      {selectedStock.changePercent.toFixed(2)}%
                    </div>
                  )}
                </CardTitle>
                
                {selectedStock && (
                  <CardDescription>
                    <div className="flex justify-between mt-2">
                      <div className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</div>
                      <div className={`flex items-center ${selectedStock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {selectedStock.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span>{selectedStock.change.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedStock ? (
                  <>
                    <StockChart 
                      data={stockChartData}
                      isUp={selectedStock.change >= 0}
                      height={200}
                    />
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Volume</p>
                        <p className="font-medium">
                          {selectedStock.volume.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Market Cap</p>
                        <p className="font-medium">
                          ${(selectedStock.marketCap / 1000000000).toFixed(2)}B
                        </p>
                      </div>
                      
                      {selectedStock.prediction && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground">ML Prediction</p>
                            <p className={`font-medium ${
                              selectedStock.prediction.trend === 'up' 
                                ? 'text-success' 
                                : selectedStock.prediction.trend === 'down' 
                                  ? 'text-destructive'
                                  : ''
                            }`}>
                              ${selectedStock.prediction.nextDayPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Confidence</p>
                            <p className="font-medium">
                              {(selectedStock.prediction.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button 
                        className="flex-1"
                        onClick={() => handleBuy(selectedStock)}
                      >
                        Buy
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a stock to view details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
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

export default Market;
