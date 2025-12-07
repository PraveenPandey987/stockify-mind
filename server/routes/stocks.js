
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database for stocks
let stocks = [];

// Initialize with some stocks
const initializeStocks = () => {
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
  
  stocks = techStocks.map((stock, index) => {
    const basePrice = getRandomPrice(50, 500);
    const previousPrice = basePrice * (1 + (Math.random() * 0.06 - 0.03));
    const change = basePrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    
    return {
      id: `stock-${index + 1}`,
      symbol: stock.symbol,
      name: stock.name,
      price: basePrice,
      previousPrice,
      change,
      changePercent,
      volume: getRandomVolume(500000, 10000000),
      marketCap: getRandomVolume(10000000000, 3000000000000),
      lastUpdated: new Date().toISOString()
    };
  });
};

// Helper functions
const getRandomPrice = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const getRandomVolume = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Initialize stocks on startup
initializeStocks();

// Get all stocks
router.get('/', (req, res) => {
  res.json(stocks);
});

// Get stock by ID
router.get('/:id', (req, res) => {
  const stock = stocks.find(s => s.id === req.params.id);
  
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }
  
  res.json(stock);
});

// Get stock by symbol
router.get('/symbol/:symbol', (req, res) => {
  const stock = stocks.find(s => s.symbol === req.params.symbol);
  
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' });
  }
  
  res.json(stock);
});

// Get trending stocks
router.get('/trending/list', (req, res) => {
  // Sort by volume (high to low) to simulate trending
  const trendingStocks = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
  
  res.json(trendingStocks);
});

// Get top gainers
router.get('/gainers/list', (req, res) => {
  // Sort by change percent (high to low)
  const gainers = [...stocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);
  
  res.json(gainers);
});

// Get top losers
router.get('/losers/list', (req, res) => {
  // Sort by change percent (low to high)
  const losers = [...stocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 10);
  
  res.json(losers);
});

// Update stock prices (simulated market changes)
router.get('/market/update', (req, res) => {
  // Update each stock with slight price changes
  stocks = stocks.map(stock => {
    const priceChange = stock.price * (Math.random() * 0.02 - 0.01); // -1% to +1%
    const newPrice = parseFloat((stock.price + priceChange).toFixed(2));
    const change = newPrice - stock.previousPrice;
    const changePercent = (change / stock.previousPrice) * 100;
    
    return {
      ...stock,
      price: newPrice,
      change,
      changePercent,
      lastUpdated: new Date().toISOString()
    };
  });
  
  res.json({ message: 'Market prices updated' });
});

module.exports = router;
