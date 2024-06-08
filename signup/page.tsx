"use client";

import { useState } from 'react';
import Header from '../components/header';
//import Footer from '../components/footer';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);
const isPhoneNumber = (phone: string): boolean => /^\d{11}$/.test(phone);

interface Errors {
  [key: string]: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    businessCategory: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateInput = (): boolean => {
    let newErrors: Errors = {};
    let isValid = true;

   
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.businessCategory) newErrors.businessCategory = "Business Category is required";

    
    if (formData.password && formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.name && formData.name.length < 2) newErrors.name = "Name must be at least 2 characters long";
    if (formData.fullName && formData.fullName.length < 2) newErrors.fullName = "Full name must be at least 2 characters long";
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (formData.phone && !isPhoneNumber(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 11 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid && Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateInput()) return;
  
    try {
      const response = await axiosInstance.post('http://localhost:4000/buser', formData);
      setShowSuccess(true); 
      setTimeout(() => {
        router.push('/signin');
      }, 2000); 
    } catch (error: any) {
      console.error('Signup failed:', error);
      setErrors(prev => ({ ...prev, general: 'Signup failed, please try again.' }));
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={key === "email" ? "email" : key === "password" ? "password" : "text"}
              id={key}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
              value={formData[key as keyof typeof formData]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
            {errors[key] && <p className="text-red-500 text-xs italic">{errors[key]}</p>}
          </div>
        ))}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Sign Up
        </button>
      </form>
      {showSuccess && (
      <div role="alert" className="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Signup Successful! Welcome to ChatApp.</span>
      </div>
    )}
      <Link href="/signin" className="link link-hover text-info font-bold">
        Already have an account? Sign in here!
      </Link>
    </div>
  );
};

export default SignupPage;