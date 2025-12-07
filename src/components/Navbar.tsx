
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, LineChart, Briefcase, LightbulbIcon, User, Settings, LogIn, LogOut, UserPlus, Bell } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-8 max-w-7xl">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-xl sm:inline-block">Stockify</span>
          </Link>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <Link to="/">
            <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm">
              <LineChart className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </Link>
          
          {isAuthenticated && (
            <>
              <Link to="/market">
                <Button variant={isActive('/market') ? 'default' : 'ghost'} size="sm">
                  <BarChart className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Market</span>
                  <span className="sm:hidden">Market</span>
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant={isActive('/portfolio') ? 'default' : 'ghost'} size="sm">
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Portfolio</span>
                  <span className="sm:hidden">Portfolio</span>
                </Button>
              </Link>
              <Link to="/predictions">
                <Button variant={isActive('/predictions') ? 'default' : 'ghost'} size="sm">
                  <LightbulbIcon className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Predictions</span>
                  <span className="sm:hidden">AI</span>
                </Button>
              </Link>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-2">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className="rounded-full"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover" 
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/portfolio')}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  My Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')} 
                className="flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Login</span>
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/register')}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Sign Up</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
