"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import { useRouter } from 'next/navigation'; 

const EditProfile = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        fullName: '',
        phone: '',
        email: '',
        businessCategory: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:4000/buser/view-profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const { name, fullName, phone, email, businessCategory } = response.data;
            setFormData({ name, fullName, phone, email, businessCategory });  
            setProfilePictureUrl(response.data.profilePicture || '');
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching your profile.');
        }
    };
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleProfilePictureUpload = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('file', profilePicture);

            const response = await axios.post('http://localhost:4000/buser/profile-picture', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfilePictureUrl(response.data.profilePictureUrl);
            setError('Profile picture updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to upload profile picture.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        console.log('Updating with formData:', formData); 
    
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.put('http://localhost:4000/buser/edit-profile', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setLoading(false);
            setFormData(response.data);
            setError('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError(err.response?.data?.message || 'An error occurred while updating your profile.');
        }
    };
    

    const handleDelete = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete('http://localhost:4000/buser/delete-profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setIsModalOpen(false);
            setError('Profile deleted successfully.');
            setTimeout(() => {
                router.push('/signin');
            }, 2000); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to delete profile.');
        }
    };

    return (
        <AuthLayout>
            <div className="p-4 overflow-auto">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Edit Your Profile</h1>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center mb-4">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    {profilePictureUrl ? (
                                        <img src={`http://localhost:4000/${profilePictureUrl}`} alt="Profile Picture" />
                                    ) : (
                                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Default Profile Picture" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="btn btn-primary">
                                Upload Profile Picture
                            </label>
                            <input
                                type="file"
                                id="profilePicture"
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                            />
                            <button type="button" onClick={handleProfilePictureUpload} className="btn btn-primary ml-2">
                                Upload
                            </button>
                        </div>
                     
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-3 bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-3 bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-3 bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-3 bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                name="businessCategory"
                                placeholder="Business Category"
                                value={formData.businessCategory}
                                onChange={handleChange}
                                className="input input-bordered w-full mb-3 bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary mt-4">
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(true)} className="btn btn-error mt-4 ml-4">
                            Delete Profile
                        </button>
                    </form>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Do you want to delete your profile?</h3>
                        <div className="modal-action">
                            <button onClick={handleDelete} className="btn btn-error">Delete</button>
                            <button onClick={() => setIsModalOpen(false)} className="btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default EditProfile;