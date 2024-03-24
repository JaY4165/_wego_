import React from 'react';
import { ModeToggle } from './ModeToggle';
import AvatarDrop from './AvatarDrop';
import readUser from '@/utils/supabase/readUser';
import Link from 'next/link';
import { Button } from '../ui/button';
import prisma from '@/lib/db';

async function Navbar() {
  const { user } = await readUser();
  // console.log(user);
  if (user?.data?.user?.email) {
    const userExists = await prisma.profiles.findUnique({
      where: {
        email: user?.data?.user?.email,
        user_id: user?.data?.user?.id,
      },
    });

    if (!userExists) {
      await prisma.profiles.create({
        data: {
          email: user?.data?.user?.email as string,
          user_id: user?.data?.user?.id,
        },
      });
    }
  }

  return (
    <header className="container z-50">
      <nav className="flex w-full justify-between items-center pt-4 z-50">
        <div>
          <Link href={'/'}>
            <h1 className="text-xl">WeGo</h1>
          </Link>
        </div>
        <div className="flex gap-x-5">
          <ModeToggle />

          {user?.data?.user?.email ? (
            <div className="cursor-pointer">
              <AvatarDrop user={user.data} />
            </div>
          ) : (
            <Button asChild className="cursor-pointer">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
