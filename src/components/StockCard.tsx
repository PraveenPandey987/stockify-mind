
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart, 
  TrendingUp, 
  TrendingDown,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnimatedNumber from './AnimatedNumber';

export interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  prediction?: {
    nextDayPrice: number;
    confidence: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

interface StockCardProps {
  stock: StockData;
  onBuy?: (stock: StockData) => void;
  onSell?: (stock: StockData) => void;
  onView?: (stock: StockData) => void;
  isFeatured?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  onBuy, 
  onSell, 
  onView,
  isFeatured = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading delay for nice animation
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  const isUp = stock.change >= 0;
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else {
      return value.toLocaleString();
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-500 stock-card",
        isUp ? "stock-card-up" : "stock-card-down",
        !isLoaded && "opacity-0 translate-y-4",
        isFeatured && "md:col-span-2 lg:col-span-3"
      )}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center font-bold">
              {stock.symbol}
              {stock.prediction && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-2">
                        {stock.prediction.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : stock.prediction.trend === 'down' ? (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        ) : (
                          <BarChart className="h-4 w-4 text-muted-foreground" />
                        )}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-sm">ML Prediction: {formatCurrency(stock.prediction.nextDayPrice)}</p>
                      <p className="text-xs text-muted-foreground">Confidence: {(stock.prediction.confidence * 100).toFixed(1)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">
              <AnimatedNumber
                value={stock.price}
                previousValue={stock.previousPrice}
                prefix="$"
              />
            </div>
            <div className={cn(
              "flex items-center justify-end text-sm",
              isUp ? "text-success" : "text-destructive"
            )}>
              {isUp ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              <span>{stock.change.toFixed(2)}</span>
              <span className="ml-1">({stock.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="text-sm font-medium">{formatLargeNumber(stock.volume)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-medium">{formatLargeNumber(stock.marketCap)}</p>
          </div>
          
          {isFeatured && stock.prediction && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Prediction</p>
                <p className="text-sm font-medium">{formatCurrency(stock.prediction.nextDayPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-sm font-medium">{(stock.prediction.confidence * 100).toFixed(1)}%</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        {onBuy && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onBuy(stock)}
          >
            Buy
          </Button>
        )}
        
        {onSell && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onSell(stock)}
          >
            Sell
          </Button>
        )}
        
        {onView && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(stock)}
          >
            View
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StockCard;
