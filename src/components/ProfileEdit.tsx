
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Edit2, Save, X, User } from 'lucide-react';
import { toast } from 'sonner';

const ProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    
    updateUser({ name, email });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Use a file reader to get a data URL from the file
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateUser({ avatar: reader.result });
        toast.success('Profile picture updated');
      }
    };
    reader.readAsDataURL(file);
  };
  
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Card className="w-full overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/40"></div>
      <CardHeader className="-mt-16 flex flex-col items-center pt-0">
        <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-3xl bg-primary/10">
              <User className="h-12 w-12 text-primary/60" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Click to change profile picture</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        
        <CardTitle className="mt-4 text-center">{user.name}</CardTitle>
        <CardDescription className="text-center">{user.email}</CardDescription>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <span>Member since</span>
          <span>{new Date(user.joinDate).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="w-full space-y-4 mt-6">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 px-6 py-4">
        {isEditing ? (
          <div className="flex w-full space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="w-full">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileEdit;
