// OpeningPage.js

import React from 'react';
import Link from 'next/link';
import Header from './components/header';
import Footer from './components/footer';

const OpeningPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header /> {/* Include Header component */}
      <h1 className="text-3xl font-bold mb-8">Welcome to ChatApp</h1>
      <img src="/images.png" alt="ChatApp Logo" className="w-24 h-24 mb-8" />
      <Link href="/signin">
        <div className="text-blue-500 underline mb-8">Click here to login</div>
      </Link>
      <Footer /> {/* Include Footer component */}
    </div>
  );
};

export default OpeningPage;
