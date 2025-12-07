
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_example');

// In-memory database for transactions
const transactions = [];

// Process payment with Stripe
router.post('/process-payment', async (req, res) => {
  const { paymentMethodId, amount, stockSymbol, quantity, price } = req.body;
  
  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Purchase of ${quantity} shares of ${stockSymbol}`,
    });
    
    // If payment successful, create transaction record
    if (paymentIntent.status === 'succeeded') {
      const transaction = {
        transactionId: uuidv4(),
        stockSymbol,
        quantity,
        price,
        amount,
        timestamp: new Date().toISOString(),
        status: 'completed',
        paymentMethod: 'credit_card',
        stripePaymentIntentId: paymentIntent.id
      };
      
      transactions.push(transaction);
      
      return res.json({
        success: true,
        message: 'Payment successful',
        transaction
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment failed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Stripe payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing error',
      error: error.message
    });
  }
});

// Process QR code payment (simulated)
router.post('/qrcode-payment', (req, res) => {
  const { stockSymbol, quantity, price, amount } = req.body;
  
  // Simulate payment processing delay
  setTimeout(() => {
    const transaction = {
      transactionId: uuidv4(),
      stockSymbol,
      quantity,
      price,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed',
      paymentMethod: 'qr_code'
    };
    
    transactions.push(transaction);
    
    res.json({
      success: true,
      message: 'QR code payment successful',
      transaction
    });
  }, 1500);
});

// Process crypto payment (simulated)
router.post('/crypto-payment', (req, res) => {
  const { stockSymbol, quantity, price, amount, cryptoType } = req.body;
  
  // Simulate payment processing delay
  setTimeout(() => {
    const transaction = {
      transactionId: uuidv4(),
      stockSymbol,
      quantity,
      price,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed',
      paymentMethod: 'crypto',
      cryptoType
    };
    
    transactions.push(transaction);
    
    res.json({
      success: true,
      message: 'Crypto payment successful',
      transaction
    });
  }, 2000);
});

// Process UPI payment (simulated)
router.post('/upi-payment', (req, res) => {
  const { stockSymbol, quantity, price, amount, upiId } = req.body;
  
  // Simulate payment processing delay
  setTimeout(() => {
    const transaction = {
      transactionId: uuidv4(),
      stockSymbol,
      quantity,
      price,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed',
      paymentMethod: 'upi',
      upiId
    };
    
    transactions.push(transaction);
    
    res.json({
      success: true,
      message: 'UPI payment successful',
      transaction
    });
  }, 1000);
});

// Get transaction by ID
router.get('/transactions/:transactionId', (req, res) => {
  const transaction = transactions.find(t => t.transactionId === req.params.transactionId);
  
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  
  res.json(transaction);
});

// Get all transactions (in a real app, this would be filtered by user)
router.get('/transactions', (req, res) => {
  res.json(transactions);
});

module.exports = router;
