
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { StockData } from './StockCard';
import StockCard from './StockCard';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BarChart as RechartsBarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface MLPredictionProps {
  stocks: StockData[];
  onBuy?: (stock: StockData) => void;
  onView?: (stock: StockData) => void;
}

const MLPrediction: React.FC<MLPredictionProps> = ({ 
  stocks,
  onBuy,
  onView
}) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  
  // Get stocks with predictions
  const stocksWithPredictions = stocks.filter(stock => stock.prediction);
  
  // Sort stocks by prediction confidence
  const sortedByConfidence = [...stocksWithPredictions].sort(
    (a, b) => (b.prediction?.confidence || 0) - (a.prediction?.confidence || 0)
  );
  
  // Get top bullish predictions (up trend with highest confidence)
  const bullishPredictions = stocksWithPredictions
    .filter(stock => stock.prediction?.trend === 'up')
    .sort((a, b) => (b.prediction?.confidence || 0) - (a.prediction?.confidence || 0))
    .slice(0, 5);
  
  // Get top bearish predictions (down trend with highest confidence)
  const bearishPredictions = stocksWithPredictions
    .filter(stock => stock.prediction?.trend === 'down')
    .sort((a, b) => (b.prediction?.confidence || 0) - (a.prediction?.confidence || 0))
    .slice(0, 5);
  
  // Prepare data for the prediction performance chart (simulated)
  const performanceData = [
    { name: 'January', accuracy: 78 },
    { name: 'February', accuracy: 82 },
    { name: 'March', accuracy: 76 },
    { name: 'April', accuracy: 84 },
    { name: 'May', accuracy: 89 },
    { name: 'June', accuracy: 87 },
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`Accuracy: ${payload[0].value}%`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="performance">ML Performance</TabsTrigger>
          <TabsTrigger value="all">All Predictions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bullish Predictions */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <ArrowUpRight className="h-5 w-5 text-success mr-2" />
                  <CardTitle>Bullish Predictions</CardTitle>
                </div>
                <CardDescription>
                  Stocks predicted to rise with high confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bullishPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {bullishPredictions.map((stock) => (
                      <div key={stock.id} className="p-3 rounded-lg bg-success/10 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${stock.price.toFixed(2)}</div>
                          <div className="text-sm text-success flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>
                              Pred: ${stock.prediction?.nextDayPrice.toFixed(2)} 
                              <span className="text-xs ml-1">
                                ({(((stock.prediction?.nextDayPrice || 0) - stock.price) / stock.price * 100).toFixed(1)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No bullish predictions available
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Bearish Predictions */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <ArrowDownRight className="h-5 w-5 text-destructive mr-2" />
                  <CardTitle>Bearish Predictions</CardTitle>
                </div>
                <CardDescription>
                  Stocks predicted to fall with high confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bearishPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {bearishPredictions.map((stock) => (
                      <div key={stock.id} className="p-3 rounded-lg bg-destructive/10 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${stock.price.toFixed(2)}</div>
                          <div className="text-sm text-destructive flex items-center">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            <span>
                              Pred: ${stock.prediction?.nextDayPrice.toFixed(2)}
                              <span className="text-xs ml-1">
                                ({(((stock.prediction?.nextDayPrice || 0) - stock.price) / stock.price * 100).toFixed(1)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No bearish predictions available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <CardTitle>AI Market Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg glass-panel">
                  <h3 className="font-medium mb-2">Market Sentiment</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on our machine learning analysis, the market shows a slightly bullish trend for the next trading day. 
                    Market volatility is predicted to be moderate.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <h3 className="font-medium mb-2">Sector Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Technology stocks are showing strong positive signals, while energy sector predictions indicate potential 
                    downward pressure. Financial stocks remain relatively neutral.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Disclaimer</h3>
                      <p className="text-xs text-muted-foreground">
                        All predictions are based on machine learning models and historical data. 
                        Past performance is not indicative of future results. Always conduct your own research 
                        before making investment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Overall Accuracy</CardDescription>
                <CardTitle className="text-3xl">82.4%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Based on last 6 months of predictions
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Bullish Accuracy</CardDescription>
                <CardTitle className="text-3xl">86.2%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-success">
                  +2.8% from previous period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Bearish Accuracy</CardDescription>
                <CardTitle className="text-3xl">78.9%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-destructive">
                  -1.2% from previous period
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                      {performanceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.accuracy > 80 ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How Our ML Model Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg glass-panel">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">1</span>
                    Data Collection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our model ingests historical price data, trading volumes, market sentiment from news sources, 
                    and macroeconomic indicators to create a comprehensive market view.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">2</span>
                    Feature Engineering
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We transform raw data into meaningful features using technical indicators (like MACD, RSI), 
                    and create derived metrics that highlight patterns.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">3</span>
                    Model Training
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We use ensemble learning techniques combining gradient boosting, LSTM neural networks, and 
                    random forests to capture complex market dynamics and relationships.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm">4</span>
                    Continuous Learning
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our models are retrained daily with the latest market data, continuously refining predictions 
                    and adapting to changing market conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Stock Predictions</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-sm">Stocks with ML-powered price predictions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              {sortedByConfidence.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedByConfidence.map((stock) => (
                    <StockCard 
                      key={stock.id} 
                      stock={stock}
                      onBuy={onBuy}
                      onView={onView}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <h3 className="font-medium text-lg mb-2">No Predictions Available</h3>
                  <p className="text-muted-foreground">
                    Check back later for ML-powered stock predictions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MLPrediction;
