
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinDate: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('stockify_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('stockify_user');
      }
    }
    setIsLoading(false);
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('stockify_user', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully');
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Create mock user data
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: email,
        name: email.split('@')[0],
        joinDate: new Date().toISOString(),
        token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      };
      
      setUser(mockUser);
      localStorage.setItem('stockify_user', JSON.stringify(mockUser));
      toast.success(`Welcome back, ${mockUser.name}!`);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate OTP sending
      setTimeout(() => {
        toast.success('OTP has been sent to your email');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to request OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Create mock user data
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: email,
        name: email.split('@')[0],
        joinDate: new Date().toISOString(),
        token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      };
      
      setUser(mockUser);
      localStorage.setItem('stockify_user', JSON.stringify(mockUser));
      toast.success(`Welcome, ${mockUser.name}!`);
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stockify_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        requestOtp,
        verifyOtp,
        logout,
        updateUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
