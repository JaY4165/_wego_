import React from 'react';
import { ModeToggle } from './ModeToggle';

function Navbar() {
  return (
    <nav className="container flex w-full justify-between items-center pt-4">
      <div>
        <h1 className="text-xl">WeGo</h1>
      </div>
      <div>
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
