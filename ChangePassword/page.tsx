"use client"
import React, { useState } from 'react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const validateEmail = (email) => {
        if (!email) return "Email should not be empty.";
        if (!/\S+@\S+\.\S+/.test(email)) return "Email must be a valid email address.";
        return "";
    };

    const validateCurrentPassword = (password) => {
        if (!password) return "Current password should not be empty.";
        return "";
    };

    const validateNewPassword = (password) => {
        if (!password) return "New password should not be empty.";
        if (password.length < 6) return "New password must be at least 6 characters long.";
        if (!/[A-Z]/.test(password)) return "New password must include at least one uppercase character.";
        if (!/[0-9]/.test(password)) return "New password must include at least one number.";
        if (!/[^A-Za-z0-9]/.test(password)) return "New password must include at least one special character.";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
    
        let error = "";
        if (name === "email") error = validateEmail(value);
        else if (name === "currentPassword") error = validateCurrentPassword(value);
        else if (name === "newPassword") error = validateNewPassword(value);
        else if (name === "confirmNewPassword") {
            error = value !== formData.newPassword ? "New password and confirmation do not match." : "";
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {
            email: validateEmail(formData.email),
            currentPassword: validateCurrentPassword(formData.currentPassword),
            newPassword: validateNewPassword(formData.newPassword),
            confirmNewPassword: formData.confirmNewPassword !== formData.newPassword ? "New password and confirmation do not match." : ""
        };

    
        Object.values(newErrors).forEach(error => {
            if (error) isValid = false;
        });

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setMessage('');
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.patch('http://localhost:4000/buser/change-password', {
                email: formData.email,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setMessage('Password changed successfully!');
            setFormData({
                email: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
        } catch (err) {
            console.error(err);
            setErrors({ form: err.response?.data?.message || 'An error occurred while updating your password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="p-4 overflow-auto">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Change Your Password</h1>
                    {message && (
                        <div role="alert" className="alert alert-success mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{message}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="Current Password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                name="confirmNewPassword"
                                placeholder="Confirm New Password"
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>}
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary mt-4">
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                    {errors.form && <div className="mt-4 text-red-500">{errors.form}</div>}
                </div>
            </div>
        </AuthLayout>
    );
};

export default ChangePassword;