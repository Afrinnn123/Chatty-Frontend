// ForgotPasswordPage.tsx
"use client";

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Header from '../components/header';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axiosInstance.post('http://localhost:4000/auth/forgot-password', { email });
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('Failed to send forgot password email:', error);
      setError('Failed to send forgot password email. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          {success ? (
            <div>
              <p className="mb-4">An email with instructions to reset your password has been sent.</p>
              <button className="btn btn-primary" onClick={() => router.push('/signin')}>
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label" htmlFor="email">
                  <span className="text-neutral">Email:</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="input input-bordered shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {error && <p className="text-error mb-4">{error}</p>}
              <button type="submit" className="btn btn-primary">
                Send Reset Email
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};


export default ForgotPasswordPage;