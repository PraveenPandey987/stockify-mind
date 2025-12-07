
import { StockData } from '@/components/StockCard';
import { ChartData } from '@/components/StockChart';
import { PortfolioData } from '@/components/Portfolio';

// Generate random date in the past n days
const getRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate random price with given min and max
const getRandomPrice = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate random percentage change
const getRandomPercentage = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate random volume
const getRandomVolume = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Generate chart data for n days
export const generateChartData = (days: number, startPrice: number, volatility: number = 0.05): ChartData[] => {
  const data: ChartData[] = [];
  let currentPrice = startPrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Apply random price movement with volatility
    const change = currentPrice * (Math.random() * volatility * 2 - volatility);
    currentPrice += change;
    
    data.push({
      date: date.toISOString(),
      value: parseFloat(currentPrice.toFixed(2)),
      volume: getRandomVolume(100000, 10000000)
    });
  }
  
  return data;
};

// Set of tech stock symbols and names
const techStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
  { symbol: 'INTC', name: 'Intel Corporation' }
];

// Generate a random stock
const generateRandomStock = (id: string, symbol: string, name: string, trending: boolean = false): StockData => {
  const basePrice = getRandomPrice(50, 500);
  const previousPrice = basePrice * (1 + (Math.random() * 0.06 - 0.03));
  const change = basePrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  
  // Add ML prediction to some stocks
  let prediction = undefined;
  if (Math.random() > 0.3) {
    const predictionChange = basePrice * (Math.random() * 0.1 - 0.05);
    const nextDayPrice = basePrice + predictionChange;
    const trend = predictionChange > 0 ? 'up' : predictionChange < 0 ? 'down' : 'neutral';
    
    prediction = {
      nextDayPrice,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      trend
    };
  }
  
  return {
    id,
    symbol,
    name,
    price: basePrice,
    previousPrice,
    change,
    changePercent,
    volume: getRandomVolume(500000, 10000000),
    marketCap: getRandomVolume(10000000000, 3000000000000),
    prediction
  };
};

// Generate a list of stocks
export const generateStocks = (count: number = 20): StockData[] => {
  const stocks: StockData[] = [];
  
  // First add the tech stocks
  techStocks.forEach((stock, index) => {
    stocks.push(generateRandomStock(`stock-${index + 1}`, stock.symbol, stock.name, true));
  });
  
  // Add additional random stocks if needed
  for (let i = stocks.length; i < count; i++) {
    const symbol = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                  String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
    
    const name = `${symbol} Corporation`;
    
    stocks.push(generateRandomStock(`stock-${i + 1}`, symbol, name));
  }
  
  return stocks;
};

// Generate top gainers from stock list
export const getTopGainers = (stocks: StockData[], count: number = 5): StockData[] => {
  return [...stocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, count);
};

// Generate top losers from stock list
export const getTopLosers = (stocks: StockData[], count: number = 5): StockData[] => {
  return [...stocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, count);
};

// Generate trending stocks
export const getTrendingStocks = (stocks: StockData[], count: number = 5): StockData[] => {
  return [...stocks]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

// Generate market indices
export const generateIndices = () => {
  return [
    {
      name: 'S&P 500',
      value: getRandomPrice(4000, 4500),
      change: getRandomPrice(-20, 30),
      changePercent: getRandomPercentage(-0.5, 0.8)
    },
    {
      name: 'Dow Jones',
      value: getRandomPrice(33000, 35000),
      change: getRandomPrice(-100, 200),
      changePercent: getRandomPercentage(-0.4, 0.6)
    },
    {
      name: 'Nasdaq',
      value: getRandomPrice(13000, 14500),
      change: getRandomPrice(-50, 80),
      changePercent: getRandomPercentage(-0.6, 0.9)
    },
    {
      name: 'Russell 2000',
      value: getRandomPrice(1800, 2000),
      change: getRandomPrice(-15, 25),
      changePercent: getRandomPercentage(-0.8, 1.0)
    }
  ];
};

// Generate recent activity
export const generateRecentActivity = (stocks: StockData[], count: number = 5) => {
  const activities = [];
  
  for (let i = 0; i < count; i++) {
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    
    activities.push({
      id: `activity-${i + 1}`,
      type: Math.random() > 0.5 ? 'buy' as const : 'sell' as const,
      stockSymbol: randomStock.symbol,
      quantity: Math.floor(Math.random() * 20) + 1,
      price: randomStock.price,
      date: getRandomDate(5)
    });
  }
  
  // Sort by date, newest first
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate portfolio holdings
export const generatePortfolioHoldings = (stocks: StockData[], count: number = 3) => {
  const holdings = [];
  const usedStockIds = new Set();
  
  for (let i = 0; i < count; i++) {
    // Get a random stock that hasn't been used yet
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * stocks.length);
    } while (usedStockIds.has(stocks[randomIndex].id));
    
    const stock = stocks[randomIndex];
    usedStockIds.add(stock.id);
    
    // Generate a random average price near the current price
    const averagePrice = stock.price * (1 + (Math.random() * 0.1 - 0.05));
    
    holdings.push({
      stockId: stock.id,
      quantity: Math.floor(Math.random() * 20) + 1,
      averagePrice,
      stock
    });
  }
  
  return holdings;
};

// Generate portfolio history data
export const generatePortfolioHistory = (days: number = 30, initialValue: number = 10000, finalValue: number = 12000) => {
  const data = [];
  const step = (finalValue - initialValue) / days;
  
  for (let i = 0; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Calculate base value for this day
    const baseValue = initialValue + (step * i);
    
    // Add some randomness
    const randomFactor = 1 + (Math.random() * 0.06 - 0.03);
    const value = parseFloat((baseValue * randomFactor).toFixed(2));
    
    data.push({
      date: date.toISOString(),
      value
    });
  }
  
  return data;
};

// Generate full portfolio data
export const generatePortfolioData = (stocks: StockData[]): PortfolioData => {
  const holdings = generatePortfolioHoldings(stocks, 5);
  
  // Calculate total invested value
  const investedValue = holdings.reduce(
    (sum, holding) => sum + (holding.quantity * holding.averagePrice), 
    0
  );
  
  // Set cash balance randomly between 20-50% of invested value
  const cashPercentage = Math.random() * 0.3 + 0.2;
  const balance = parseFloat((investedValue * cashPercentage).toFixed(2));
  
  // Generate portfolio history
  const totalValue = holdings.reduce(
    (sum, holding) => sum + (holding.quantity * holding.stock.price), 
    0
  ) + balance;
  
  const startValue = totalValue * (1 - (Math.random() * 0.2));
  const history = generatePortfolioHistory(30, startValue, totalValue);
  
  return {
    balance,
    holdings,
    history
  };
};

// Generate full market data
export const generateMarketData = (stocks: StockData[]) => {
  return {
    trendingStocks: getTrendingStocks(stocks, 10),
    topGainers: getTopGainers(stocks, 10),
    topLosers: getTopLosers(stocks, 10),
    indices: generateIndices(),
    recentActivity: generateRecentActivity(stocks, 5)
  };
};
