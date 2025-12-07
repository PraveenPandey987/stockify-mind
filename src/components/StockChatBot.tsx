
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, Bot, Loader2, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const BOT_AVATAR = 'https://api.dicebear.com/7.x/bottts/svg?seed=stockify';
const USER_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user';

// Fallback responses for demonstration purposes
const fallbackResponses = {
  greetings: [
    "Hello! I'm your Stockify assistant. How can I help you with your investments today?",
    "Hi there! Welcome to Stockify. I'm here to assist with your stock queries.",
    "Greetings! I'm your AI investment assistant. How can I help you navigate the markets today?"
  ],
  stocks: [
    "Based on current market analysis, tech stocks are showing strong momentum, particularly in AI and semiconductor sectors.",
    "Recent market indicators suggest defensive stocks might be a good option during the current economic uncertainty.",
    "The healthcare sector has been outperforming the broader market in recent weeks, with biotech showing particular strength."
  ],
  portfolio: [
    "For a balanced portfolio, consider allocating 60% to stocks, 30% to bonds, and 10% to alternative investments. This provides growth potential while managing risk.",
    "Dollar-cost averaging can be an effective strategy for long-term investors, helping to reduce the impact of market volatility.",
    "When reviewing your portfolio, look at sector diversification as well as asset allocation to ensure you're not overexposed to particular market segments."
  ],
  market: [
    "The current market conditions show increased volatility due to recent Federal Reserve announcements. Consider adjusting your risk exposure accordingly.",
    "Market sentiment indicators are showing cautious optimism, with institutional investors gradually increasing their equity positions.",
    "Technical indicators suggest the market may be approaching a resistance level. Watch for potential consolidation in the coming weeks."
  ]
};

// Helper function to get a fallback response
const getFallbackResponse = (message: string) => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
    return fallbackResponses.greetings[Math.floor(Math.random() * fallbackResponses.greetings.length)];
  } else if (lowercaseMessage.includes('stock') || lowercaseMessage.includes('invest')) {
    return fallbackResponses.stocks[Math.floor(Math.random() * fallbackResponses.stocks.length)];
  } else if (lowercaseMessage.includes('portfolio') || lowercaseMessage.includes('my investment')) {
    return fallbackResponses.portfolio[Math.floor(Math.random() * fallbackResponses.portfolio.length)];
  } else if (lowercaseMessage.includes('market') || lowercaseMessage.includes('trend')) {
    return fallbackResponses.market[Math.floor(Math.random() * fallbackResponses.market.length)];
  }
  
  return "I understand you're asking about investments. For specific stock advice, please check our market analysis section or ask a more specific question about a particular stock, sector, or investment strategy.";
};

// Mock AI API call (in real implementation, this would call an actual API)
const callChatAPI = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Try to call an actual API if configured
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = localStorage.getItem('stock_chatbot_api_key');
    
    if (apiKey) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful finance and stock market assistant for the Stockify app. Provide concise, accurate information about stocks, market trends, investment strategies, and portfolio management. Use professional language and avoid overly technical jargon unless specifically asked. If asked about specific stocks, provide general information but avoid making specific buy/sell recommendations. Focus on educational content about finance and investing principles.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        console.error('API error:', await response.text());
        // Fall back to local response
        return getFallbackResponse(message);
      }
    } else {
      // No API key, use fallback
      return getFallbackResponse(message);
    }
  } catch (error) {
    console.error('Error calling chat API:', error);
    // Use fallback responses if API call fails
    return getFallbackResponse(message);
  }
};

const StockChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Stockify's AI assistant. How can I help you with investments today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('stock_chatbot_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await callChatAPI(message);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const saveApiKey = () => {
    localStorage.setItem('stock_chatbot_api_key', apiKey);
    setShowApiKeyInput(false);
    toast.success('API key saved!');
  };
  
  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg"
        aria-label="Open chat"
      >
        <Bot className="h-6 w-6" />
      </Button>
      
      {/* Chat modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <Card className="relative z-50 w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-10 duration-300 sm:max-h-[600px] md:max-h-[700px] flex flex-col">
            <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Stockify AI Assistant
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            
            <div className="relative px-4 h-full max-h-[50vh] overflow-auto" ref={chatContentRef}>
              <div className="space-y-4 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={msg.role === 'user' ? USER_AVATAR : BOT_AVATAR} />
                        <AvatarFallback>{msg.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={BOT_AVATAR} />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 text-sm bg-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <CardFooter className="px-4 py-3 border-t mt-auto">
              {showApiKeyInput ? (
                <div className="flex w-full gap-2 flex-col">
                  <p className="text-xs text-muted-foreground">Enter your OpenAI API key for enhanced responses</p>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowApiKeyInput(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveApiKey}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full items-center gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about stocks, markets, or investment strategies..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    size="icon"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setShowApiKeyInput(true)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent"
                    title="Configure API Key"
                  >
                    <ArrowUp className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default StockChatBot;
