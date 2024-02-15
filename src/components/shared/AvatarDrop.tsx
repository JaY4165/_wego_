'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/app/actions/auth-actions';
import { toast } from '@/components/ui/use-toast';

const AvatarDrop = ({ user }: any) => {
  const userName = user?.user?.email.split('@')[0];

  const handleSignOut = async () => {
    try {
      const err: any = await signOut();
      console.log('err', err);
      if (err !== 'null') {
        toast({
          title: 'Error',
          description: JSON.parse(err),
          duration: 5000,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Logged in as {userName || 'user'}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Reset Password</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSignOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDrop;
