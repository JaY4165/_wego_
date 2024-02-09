import React from 'react';
import { ModeToggle } from './ModeToggle';
import AvatarDrop from './AvatarDrop';

function Navbar() {
  return (
    <nav className="container flex w-full justify-between items-center pt-4">
      <div>
        <h1 className="text-xl">WeGo</h1>
      </div>
      <div className="flex gap-x-5">
        <ModeToggle />

        <div className="cursor-pointer">
          <AvatarDrop />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
