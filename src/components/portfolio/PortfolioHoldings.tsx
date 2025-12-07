
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PortfolioData } from '../Portfolio';
import { StockData } from '../StockCard';

interface PortfolioHoldingsProps {
  data: PortfolioData;
  onBuy?: (stock: StockData) => void;
  onSell?: (stock: StockData) => void;
}

const PortfolioHoldings: React.FC<PortfolioHoldingsProps> = ({ data, onBuy, onSell }) => {
  const sortedHoldings = [...data.holdings].sort((a, b) => {
    const valueA = a.quantity * a.stock.price;
    const valueB = b.quantity * b.stock.price;
    return valueB - valueA;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHoldings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedHoldings.map((holding) => (
              <div key={holding.stockId} className="stock-card rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{holding.stock.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{holding.stock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${holding.stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${
                        holding.stock.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {holding.stock.change >= 0 ? '+' : ''}
                        {holding.stock.change.toFixed(2)} ({holding.stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Shares: </span>
                      <span className="font-medium">{holding.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Price: </span>
                      <span className="font-medium">${holding.averagePrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Value: </span>
                      <span className="font-medium">
                        ${(holding.quantity * holding.stock.price).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gain/Loss: </span>
                      <span className={`font-medium ${
                        holding.stock.price >= holding.averagePrice ? 'text-success' : 'text-destructive'
                      }`}>
                        {holding.stock.price >= holding.averagePrice ? '+' : ''}
                        ${((holding.stock.price - holding.averagePrice) * holding.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {onBuy && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onBuy(holding.stock)}
                      >
                        Buy More
                      </Button>
                    )}
                    
                    {onSell && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onSell(holding.stock)}
                      >
                        Sell
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="font-medium text-lg mb-2">No Stocks in Portfolio</h3>
            <p className="text-muted-foreground mb-4">Your portfolio is empty. Start investing!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioHoldings;
