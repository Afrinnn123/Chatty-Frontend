import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 flex justify-between items-center z-10">
      <div className="flex-1">
                <a className="btn btn-ghost text-xl">ChatApp</a>
            </div>
      <div className="mr-10">
        <Link href="/signup" className="px-4 py-2 rounded hover:bg-gray-700">
          Sign Up
        </Link>
        <Link href="/signin" className="px-4 py-2 rounded hover:bg-gray-700">
          Sign In
        </Link>
      </div>
    </header>
  );
};

export default Header;
