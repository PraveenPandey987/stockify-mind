import axios from 'axios';

// Define base URL for mock data
const API_URL = '';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock stock data
const STOCKS = [
  { id: 'stock-1', symbol: 'AAPL', name: 'Apple Inc.', price: 183.58, previousPrice: 180.24, change: 3.34, changePercent: 1.85, volume: 5862100, marketCap: 2950000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-2', symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.32, previousPrice: 410.47, change: 4.85, changePercent: 1.18, volume: 3201500, marketCap: 3080000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 172.91, previousPrice: 169.85, change: 3.06, changePercent: 1.80, volume: 2103400, marketCap: 2190000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-4', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 183.32, previousPrice: 178.95, change: 4.37, changePercent: 2.44, volume: 3524600, marketCap: 1900000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-5', symbol: 'META', name: 'Meta Platforms Inc.', price: 512.74, previousPrice: 505.33, change: 7.41, changePercent: 1.47, volume: 1895200, marketCap: 1310000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-6', symbol: 'TSLA', name: 'Tesla Inc.', price: 176.89, previousPrice: 183.12, change: -6.23, changePercent: -3.40, volume: 4587200, marketCap: 565000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-7', symbol: 'NVDA', name: 'NVIDIA Corporation', price: 950.02, previousPrice: 930.47, change: 19.55, changePercent: 2.10, volume: 2985100, marketCap: 2340000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-8', symbol: 'ADBE', name: 'Adobe Inc.', price: 512.35, previousPrice: 505.15, change: 7.20, changePercent: 1.43, volume: 1021400, marketCap: 231000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-9', symbol: 'CRM', name: 'Salesforce Inc.', price: 285.74, previousPrice: 278.96, change: 6.78, changePercent: 2.43, volume: 985300, marketCap: 277000000000, lastUpdated: new Date().toISOString() },
  { id: 'stock-10', symbol: 'INTC', name: 'Intel Corporation', price: 31.15, previousPrice: 32.45, change: -1.30, changePercent: -4.01, volume: 3621800, marketCap: 131000000000, lastUpdated: new Date().toISOString() }
];

// Mock user portfolio
let USER_PORTFOLIO = {
  balance: 10000,
  holdings: [],
  transactions: []
};

// Authentication services
export const authService = {
  // All these methods now use localStorage instead of API calls
  register: async (email: string, password: string) => {
    const mockUser = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      joinDate: new Date().toISOString(),
      token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
    };
    return mockUser;
  },
  
  login: async (email: string, password: string) => {
    const mockUser = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      joinDate: new Date().toISOString(),
      token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
    };
    return mockUser;
  },
  
  requestOtp: async (email: string) => {
    return { success: true, message: 'OTP sent successfully' };
  },
  
  verifyOtp: async (email: string, otp: string) => {
    const mockUser = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      joinDate: new Date().toISOString(),
      token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
    };
    return mockUser;
  },
  
  getCurrentUser: async () => {
    const storedUser = localStorage.getItem('stockify_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    throw new Error('User not found');
  },
  
  logout: async () => {
    localStorage.removeItem('stockify_user');
    return { success: true };
  }
};

// Stock services
export const stockService = {
  getAllStocks: async () => {
    return STOCKS;
  },
  
  getStockById: async (id: string) => {
    const stock = STOCKS.find(s => s.id === id);
    if (!stock) throw new Error('Stock not found');
    return stock;
  },
  
  getStockBySymbol: async (symbol: string) => {
    const stock = STOCKS.find(s => s.symbol === symbol);
    if (!stock) throw new Error('Stock not found');
    return stock;
  },
  
  getTrendingStocks: async () => {
    return STOCKS.sort((a, b) => b.volume - a.volume).slice(0, 5);
  },
  
  getTopGainers: async () => {
    return STOCKS.filter(s => s.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  },
  
  getTopLosers: async () => {
    return STOCKS.filter(s => s.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
  },
  
  updateMarketPrices: async () => {
    // Simulate price changes
    STOCKS.forEach(stock => {
      const priceChange = stock.price * (Math.random() * 0.02 - 0.01);
      stock.previousPrice = stock.price;
      stock.price = parseFloat((stock.price + priceChange).toFixed(2));
      stock.change = parseFloat((stock.price - stock.previousPrice).toFixed(2));
      stock.changePercent = parseFloat(((stock.change / stock.previousPrice) * 100).toFixed(2));
      stock.lastUpdated = new Date().toISOString();
    });
    return { success: true, message: 'Prices updated' };
  }
};

// Portfolio services
export const portfolioService = {
  getPortfolio: async () => {
    return USER_PORTFOLIO;
  },
  
  addFunds: async (amount: number) => {
    USER_PORTFOLIO.balance += amount;
    USER_PORTFOLIO.transactions.push({
      id: 'txn-' + Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount,
      date: new Date().toISOString(),
      balance: USER_PORTFOLIO.balance
    });
    return USER_PORTFOLIO;
  },
  
  buyStock: async (stockId: string, stockSymbol: string, stockName: string, quantity: number, price: number) => {
    const totalCost = quantity * price;
    if (totalCost > USER_PORTFOLIO.balance) {
      throw new Error('Insufficient funds');
    }
    
    USER_PORTFOLIO.balance -= totalCost;
    
    const existingHolding = USER_PORTFOLIO.holdings.find((h: any) => h.stockId === stockId);
    if (existingHolding) {
      existingHolding.quantity += quantity;
      existingHolding.averagePrice = ((existingHolding.quantity * existingHolding.averagePrice) + (quantity * price)) / (existingHolding.quantity + quantity);
      existingHolding.lastUpdated = new Date().toISOString();
    } else {
      USER_PORTFOLIO.holdings.push({
        stockId,
        stockSymbol,
        stockName,
        quantity,
        averagePrice: price,
        lastUpdated: new Date().toISOString()
      });
    }
    
    USER_PORTFOLIO.transactions.push({
      id: 'txn-' + Math.random().toString(36).substring(2, 9),
      type: 'buy',
      stockId,
      stockSymbol,
      quantity,
      price,
      totalAmount: totalCost,
      date: new Date().toISOString()
    });
    
    return USER_PORTFOLIO;
  },
  
  sellStock: async (stockId: string, quantity: number, price: number) => {
    const holdingIndex = USER_PORTFOLIO.holdings.findIndex((h: any) => h.stockId === stockId);
    if (holdingIndex === -1) {
      throw new Error('Stock not in portfolio');
    }
    
    const holding = USER_PORTFOLIO.holdings[holdingIndex];
    if (holding.quantity < quantity) {
      throw new Error('Insufficient shares');
    }
    
    const saleAmount = quantity * price;
    USER_PORTFOLIO.balance += saleAmount;
    
    if (holding.quantity === quantity) {
      USER_PORTFOLIO.holdings.splice(holdingIndex, 1);
    } else {
      holding.quantity -= quantity;
      holding.lastUpdated = new Date().toISOString();
    }
    
    USER_PORTFOLIO.transactions.push({
      id: 'txn-' + Math.random().toString(36).substring(2, 9),
      type: 'sell',
      stockId,
      stockSymbol: holding.stockSymbol,
      quantity,
      price,
      totalAmount: saleAmount,
      date: new Date().toISOString()
    });
    
    return USER_PORTFOLIO;
  },
  
  getTransactionHistory: async () => {
    return USER_PORTFOLIO.transactions.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
};

// Payment services
export const paymentService = {
  processStripePayment: async (paymentMethodId: string, amount: number, stockSymbol: string, quantity: number, price: number) => {
    console.log('Stripe payment processed (mock):', { paymentMethodId, amount, stockSymbol, quantity, price });
    return { success: true, message: 'Payment processed successfully' };
  },
  
  processQRCodePayment: async (stockSymbol: string, quantity: number, price: number, amount: number) => {
    console.log('QR code payment processed (mock):', { stockSymbol, quantity, price, amount });
    return { success: true, message: 'Payment processed successfully' };
  },
  
  processCryptoPayment: async (stockSymbol: string, quantity: number, price: number, amount: number, cryptoType: string) => {
    console.log('Crypto payment processed (mock):', { stockSymbol, quantity, price, amount, cryptoType });
    return { success: true, message: 'Payment processed successfully' };
  },
  
  processUPIPayment: async (stockSymbol: string, quantity: number, price: number, amount: number, upiId: string) => {
    console.log('UPI payment processed (mock):', { stockSymbol, quantity, price, amount, upiId });
    return { success: true, message: 'Payment processed successfully' };
  },
  
  getTransaction: async (transactionId: string) => {
    console.log('Transaction details (mock):', { transactionId });
    return {
      id: transactionId,
      status: 'success',
      amount: 100,
      date: new Date().toISOString()
    };
  },
  
  getAllTransactions: async () => {
    console.log('All transactions (mock)');
    return [
      { id: '1', status: 'success', amount: 100, date: new Date().toISOString() },
      { id: '2', status: 'pending', amount: 50, date: new Date().toISOString() }
    ];
  }
};

// New feedback service
export const feedbackService = {
  submitFeedback: async (feedback: { rating: number; comment: string; email: string }) => {
    console.log('Feedback submitted:', feedback);
    return { success: true, message: 'Feedback submitted successfully' };
  },
  
  contactUs: async (message: { name: string; email: string; subject: string; message: string }) => {
    console.log('Contact message received:', message);
    return { success: true, message: 'Message sent successfully' };
  }
};

export default api;
