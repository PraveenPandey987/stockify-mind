
import { StockData } from '@/components/StockCard';

// Simple moving average
export const calculateSMA = (data: number[], period: number): number[] => {
  const result: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((total, val) => total + val, 0);
    result.push(sum / period);
  }
  
  return result;
};

// Exponential moving average
export const calculateEMA = (data: number[], period: number): number[] => {
  const result: number[] = [];
  const k = 2 / (period + 1);
  
  // First EMA is SMA
  const firstEMA = data.slice(0, period).reduce((total, price) => total + price, 0) / period;
  result.push(firstEMA);
  
  // Calculate the rest of the EMAs
  for (let i = period; i < data.length; i++) {
    const ema = (data[i] - result[result.length - 1]) * k + result[result.length - 1];
    result.push(ema);
  }
  
  return result;
};

// Relative Strength Index (RSI)
export const calculateRSI = (data: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const changes: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }
  
  // Calculate average gains and losses
  let avgGain = 0;
  let avgLoss = 0;
  
  // First RSI is calculated using simple average
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }
  
  avgGain /= period;
  avgLoss /= period;
  
  // Calculate first RSI
  const rs = avgGain / (avgLoss === 0 ? 1 : avgLoss);
  rsi.push(100 - (100 / (1 + rs)));
  
  // Calculate remaining RSIs
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    // Use smoothed/exponential moving average
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    const rs = avgGain / (avgLoss === 0 ? 1 : avgLoss);
    rsi.push(100 - (100 / (1 + rs)));
  }
  
  return rsi;
};

// MACD (Moving Average Convergence Divergence)
export const calculateMACD = (data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) => {
  // Calculate EMAs
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  // Calculate MACD line
  const macdLine: number[] = [];
  
  // Align the arrays (the slow EMA will have fewer points)
  const diff = fastPeriod - slowPeriod;
  for (let i = Math.abs(diff); i < fastEMA.length; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i - diff]);
  }
  
  // Calculate signal line (EMA of MACD line)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // Calculate histogram (MACD line - signal line)
  const histogram: number[] = [];
  for (let i = signalPeriod - 1; i < macdLine.length; i++) {
    histogram.push(macdLine[i] - signalLine[i - (signalPeriod - 1)]);
  }
  
  return {
    macdLine,
    signalLine,
    histogram
  };
};

// Simulated ML model prediction
export const predictStockPrice = (stock: StockData): {nextDayPrice: number, confidence: number, trend: 'up' | 'down' | 'neutral'} => {
  // Generate a random prediction within ±5% of current price
  const randomChange = stock.price * (Math.random() * 0.1 - 0.05);
  const nextDayPrice = stock.price + randomChange;
  
  // Generate a random confidence level between 70% and 95%
  const confidence = Math.random() * 0.25 + 0.7;
  
  // Determine trend
  let trend: 'up' | 'down' | 'neutral';
  if (randomChange > stock.price * 0.005) {
    trend = 'up';
  } else if (randomChange < -stock.price * 0.005) {
    trend = 'down';
  } else {
    trend = 'neutral';
  }
  
  return {
    nextDayPrice,
    confidence,
    trend
  };
};

// Apply ML predictions to a list of stocks
export const applyMLPredictions = (stocks: StockData[]): StockData[] => {
  return stocks.map(stock => {
    // Apply prediction to 80% of stocks
    if (Math.random() > 0.2) {
      return {
        ...stock,
        prediction: predictStockPrice(stock)
      };
    }
    return stock;
  });
};

// Simulated model accuracy metrics
export const getModelAccuracyMetrics = () => {
  return {
    overall: Math.random() * 0.15 + 0.75, // 75-90% accuracy
    bullish: Math.random() * 0.15 + 0.75,
    bearish: Math.random() * 0.15 + 0.75,
    monthly: [
      { month: 'January', accuracy: Math.random() * 0.2 + 0.7 },
      { month: 'February', accuracy: Math.random() * 0.2 + 0.7 },
      { month: 'March', accuracy: Math.random() * 0.2 + 0.7 },
      { month: 'April', accuracy: Math.random() * 0.2 + 0.7 },
      { month: 'May', accuracy: Math.random() * 0.2 + 0.7 },
      { month: 'June', accuracy: Math.random() * 0.2 + 0.7 }
    ]
  };
};
