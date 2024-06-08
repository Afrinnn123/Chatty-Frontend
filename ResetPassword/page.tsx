"use client";

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Modal from '../components/Modal';
import Header from '../components/header';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  console.log("Token: ", token);
 console.log("Email: ", email);

  const router = useRouter();

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
        await axiosInstance.post('http://localhost:4000/auth/reset-password', {
            email: email,
            token: token,
            newPassword: newPassword,
          });
      setShowModal(true);
    } catch (error) {
      console.error('Failed to reset password:', error);
      setError('Failed to reset password. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/signin');
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label" htmlFor="newPassword">
                <span className="text-neutral">New Password:</span>
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="input input-bordered shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text-neutral">Confirm Password:</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="input input-bordered shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {error && <p className="text-error mb-4">{error}</p>}
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </form>
        </div>
        {showModal && (
          <Modal onClose={handleCloseModal}>
            <h2 className="text-2xl font-bold mb-4">Password Reset Successful</h2>
            <p className="mb-4">Your password has been reset successfully.</p>
            <button className="btn btn-primary" onClick={handleCloseModal}>
              OK
            </button>
          </Modal>
        )}
      </div>
    </>
  );
};



export default ResetPasswordPage;