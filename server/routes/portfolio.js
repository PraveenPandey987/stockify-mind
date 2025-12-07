
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database for portfolios
const portfolios = {};

// Middleware to check auth (simplified for demo)
const isAuthenticated = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'User ID required' });
  }
  
  // Initialize portfolio if it doesn't exist
  if (!portfolios[userId]) {
    portfolios[userId] = {
      userId,
      balance: 10000, // Starting balance: $10,000
      holdings: [],
      transactions: []
    };
  }
  
  req.userId = userId;
  req.portfolio = portfolios[userId];
  next();
};

// Get user portfolio
router.get('/', isAuthenticated, (req, res) => {
  res.json(req.portfolio);
});

// Add funds to portfolio
router.post('/funds/add', isAuthenticated, (req, res) => {
  const { amount } = req.body;
  const portfolio = req.portfolio;
  
  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount must be positive' });
  }
  
  // Update balance
  portfolio.balance += parseFloat(amount);
  
  // Record transaction
  const transaction = {
    id: uuidv4(),
    type: 'deposit',
    amount: parseFloat(amount),
    date: new Date().toISOString(),
    balance: portfolio.balance
  };
  
  portfolio.transactions.push(transaction);
  
  res.json({
    message: 'Funds added successfully',
    newBalance: portfolio.balance,
    transaction
  });
});

// Buy stock
router.post('/stocks/buy', isAuthenticated, (req, res) => {
  const { stockId, stockSymbol, stockName, quantity, price } = req.body;
  const portfolio = req.portfolio;
  
  // Calculate total cost
  const totalCost = quantity * price;
  
  // Check sufficient funds
  if (totalCost > portfolio.balance) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  
  // Update balance
  portfolio.balance -= totalCost;
  
  // Check if stock already in holdings
  const existingHolding = portfolio.holdings.find(h => h.stockId === stockId);
  
  if (existingHolding) {
    // Update existing holding
    const totalShares = existingHolding.quantity + quantity;
    const newAveragePrice = ((existingHolding.quantity * existingHolding.averagePrice) + (quantity * price)) / totalShares;
    
    existingHolding.quantity = totalShares;
    existingHolding.averagePrice = newAveragePrice;
    existingHolding.lastUpdated = new Date().toISOString();
  } else {
    // Add new holding
    portfolio.holdings.push({
      stockId,
      stockSymbol,
      stockName,
      quantity,
      averagePrice: price,
      lastUpdated: new Date().toISOString()
    });
  }
  
  // Record transaction
  const transaction = {
    id: uuidv4(),
    type: 'buy',
    stockId,
    stockSymbol,
    quantity,
    price,
    totalAmount: totalCost,
    date: new Date().toISOString()
  };
  
  portfolio.transactions.push(transaction);
  
  res.json({
    message: 'Stock purchased successfully',
    transaction,
    portfolio
  });
});

// Sell stock
router.post('/stocks/sell', isAuthenticated, (req, res) => {
  const { stockId, quantity, price } = req.body;
  const portfolio = req.portfolio;
  
  // Find the holding
  const holdingIndex = portfolio.holdings.findIndex(h => h.stockId === stockId);
  
  if (holdingIndex === -1) {
    return res.status(400).json({ message: 'Stock not in portfolio' });
  }
  
  const holding = portfolio.holdings[holdingIndex];
  
  // Check sufficient shares
  if (holding.quantity < quantity) {
    return res.status(400).json({ message: 'Insufficient shares' });
  }
  
  // Calculate sale amount
  const saleAmount = quantity * price;
  
  // Update balance
  portfolio.balance += saleAmount;
  
  // Update holdings
  if (holding.quantity === quantity) {
    // Remove holding if all shares sold
    portfolio.holdings.splice(holdingIndex, 1);
  } else {
    // Update holding quantity
    holding.quantity -= quantity;
    holding.lastUpdated = new Date().toISOString();
  }
  
  // Record transaction
  const transaction = {
    id: uuidv4(),
    type: 'sell',
    stockId,
    stockSymbol: holding.stockSymbol,
    quantity,
    price,
    totalAmount: saleAmount,
    date: new Date().toISOString()
  };
  
  portfolio.transactions.push(transaction);
  
  res.json({
    message: 'Stock sold successfully',
    transaction,
    portfolio
  });
});

// Get transaction history
router.get('/transactions', isAuthenticated, (req, res) => {
  // Sort by date (newest first)
  const transactions = [...req.portfolio.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.json(transactions);
});

module.exports = router;
