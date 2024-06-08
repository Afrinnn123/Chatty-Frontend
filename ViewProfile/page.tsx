

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import AuthHeader from '../components/AuthHeader';
import AuthLayout from '../components/AuthLayout';

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/signin');
      return;
    }

   
    const fetchProfileAndPictureUrl = async () => {
      try {
        const [profileResponse, pictureResponse] = await Promise.all([
          axios.get('http://localhost:4000/buser/view-profile', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          axios.get('http://localhost:4000/buser/profile-picture', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
        ]);

        setProfile(profileResponse.data);
        setProfilePictureUrl(pictureResponse.data.profilePictureUrl);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'An error occurred while fetching profile data or profile picture URL.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPictureUrl();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <AuthLayout>
        <div className="p-4 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                {profilePictureUrl ? (
                  <img src={`http://localhost:4000/${profilePictureUrl}`} alt="Profile Picture" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">No Image</span>
                  </div>
                )}
              </div>
              <div>
                <p><strong>Name:</strong> {profile?.name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Role:</strong> {profile?.role}</p>
                <p><strong>Full Name:</strong> {profile?.fullName}</p>
                <p><strong>Phone:</strong> {profile?.phone}</p>
                <p><strong>Business Category:</strong> {profile?.businessCategory}</p>
                <p><strong>Active:</strong> {profile?.isActive ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default ViewProfile;