'use client';

import React, { useState } from 'react';
import { SettingsDialog } from '@/components/settings-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export function UserProfile() {
  const { user, activeUid, logout, isUrlAuth } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!activeUid) {
    return (
      <Button 
        onClick={() => router.push('/login')} 
        variant="outline" 
        className="h-9 font-note text-sm border-primary/50 text-primary hover:bg-primary/10 transition-colors"
      >
        Sign In
      </Button>
    );
  }

  return (
    <>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <span className="hidden"></span>
      </SettingsDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0" aria-label="Open user profile menu" title="Open user profile menu">
            <Avatar className="h-9 w-9 border border-primary/20 hover:border-primary/50 transition-colors">
              <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || (isUrlAuth ? `UID: ${activeUid?.slice(0, 8)}...` : 'User')}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isUrlAuth ? (
                  <Badge variant="default" className="text-xs bg-primary/20 text-primary hover:bg-primary/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    URL Login
                  </Badge>
                ) : user?.emailVerified ? (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut} 
            disabled={isLoading}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
