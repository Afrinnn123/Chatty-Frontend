

"use client";

import { useState } from 'react';
import Header from '../components/header'; 
import Footer from '../components/footer'; 
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function isValidEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    } else if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }

    try {
      const response = await axiosInstance.post('http://localhost:4000/auth/login', { email, password });
      const accessToken = response.data.access_token;
      const userId = response.data.user_id;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify({ id: userId, email }));
      router.push('/ViewProfile');
      setError(''); 
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 401) {
        setError('Incorrect email or password');
      } else if (error.message) {
        setError('Login failed, please try again.');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="flex w-full max-w-4xl mx-auto">
        <div className="w-1/2 flex justify-start items-center">
          <img src="/chatapp.png" alt="Chat Illustration" className="w-full max-w-none"/>
        </div>
        <div className="w-1/2">
        <h1 className="text-primary font-semibold text-left mb-6">Connect Effortlessly with ChatApp!</h1>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300 focus:bg-blue-50"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300 focus:bg-blue-50"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <Link href="/forgotPassword" className="text-sm text-blue-500 font-bold hover:text-blue-800 mt-2 inline-block">
               Forgot password?
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
          <Link href="/signup" className="link link-hover text-info" style={{ fontWeight: 'bold' }}>
            Don't have an account? Signup here!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
