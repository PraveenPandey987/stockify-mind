
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedNumber from '../AnimatedNumber';
import { PortfolioData } from '../Portfolio';
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend,
} from 'recharts';

interface PortfolioOverviewProps {
  data: PortfolioData;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ data }) => {
  const calculateTotalValue = (): number => {
    return data.holdings.reduce((total, holding) => {
      return total + (holding.quantity * holding.stock.price);
    }, 0);
  };
  
  const calculateTotalGainLoss = (): number => {
    return data.holdings.reduce((total, holding) => {
      const currentValue = holding.quantity * holding.stock.price;
      const costBasis = holding.quantity * holding.averagePrice;
      return total + (currentValue - costBasis);
    }, 0);
  };
  
  const calculateGainLossPercent = (): number => {
    const totalCost = data.holdings.reduce((total, holding) => {
      return total + (holding.quantity * holding.averagePrice);
    }, 0);
    
    if (totalCost === 0) return 0;
    
    const totalValue = calculateTotalValue();
    return ((totalValue - totalCost) / totalCost) * 100;
  };
  
  const totalValue = calculateTotalValue();
  const totalGainLoss = calculateTotalGainLoss();
  const totalGainLossPercent = calculateGainLossPercent();
  const totalAssets = totalValue + data.balance;
  
  const pieData = data.holdings.map((holding) => ({
    name: holding.stock.symbol,
    value: holding.quantity * holding.stock.price
  }));
  
  pieData.push({
    name: 'Cash',
    value: data.balance
  });
  
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const sortedHoldings = [...data.holdings].sort((a, b) => {
    const valueA = a.quantity * a.stock.price;
    const valueB = b.quantity * b.stock.price;
    return valueB - valueA;
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-3xl">
              <AnimatedNumber value={totalAssets} prefix="$" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Cash: ${data.balance.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Investments: ${totalValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Gain/Loss</CardDescription>
            <CardTitle className={`text-3xl ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              <AnimatedNumber 
                value={totalGainLoss} 
                prefix={totalGainLoss >= 0 ? '+$' : '-$'} 
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Stocks</CardDescription>
            <CardTitle className="text-3xl">
              {data.holdings.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {data.holdings.reduce((total, holding) => total + holding.quantity, 0)} shares
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)} 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No holdings to display</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedHoldings.length > 0 ? (
            <div className="space-y-4">
              {sortedHoldings.slice(0, 3).map((holding) => (
                <div 
                  key={holding.stockId} 
                  className="flex justify-between items-center p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <div className="font-medium">{holding.stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.quantity} shares @ ${holding.averagePrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${(holding.quantity * holding.stock.price).toFixed(2)}
                    </div>
                    <div className={`text-sm ${
                      holding.stock.price >= holding.averagePrice ? 'text-success' : 'text-destructive'
                    }`}>
                      {holding.stock.price >= holding.averagePrice ? '+' : ''}
                      ${((holding.stock.price - holding.averagePrice) * holding.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No holdings to display</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
