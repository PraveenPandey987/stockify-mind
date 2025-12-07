
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Sun, Moon, User, Camera, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    toast.success(`${checked ? 'Dark' : 'Light'} mode activated`);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          </div>
        </div>

        <Separator />

        {isAuthenticated && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your profile information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-medium text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  Member since {new Date(user?.joinDate || '').toLocaleDateString()}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => navigate('/profile?tab=profile')} 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/profile?tab=profile')}
                className="w-full sm:w-auto flex items-center gap-2" 
              >
                <Camera className="h-4 w-4" />
                Change Photo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/profile?tab=feedback')}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Feedback & Contact
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <Label htmlFor="theme-toggle">Dark Mode</Label>
                </div>
                <Switch 
                  id="theme-toggle" 
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>

          {isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <Label>Name</Label>
                  <p className="text-sm text-muted-foreground">{user?.name}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/profile')} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                About this application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Stockify</strong> - Version 1.0.0
              </p>
              <p className="text-sm text-muted-foreground">
                A stock market tracking and portfolio management application.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
