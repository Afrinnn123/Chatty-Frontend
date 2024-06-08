"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/footer';
import Header from '../components/header';
import Link from 'next/link';

// Define the DashboardPage component
const DashboardPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages after login
    fetchMessages();
  }, []);

  // Define an interface for the message object
  interface Message {
    id: number;
    content: string;
    user: string; // Assuming 'user' property is a string
  }

  // Fetch all messages from the backend
  const fetchMessages = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        router.push('/signin');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axiosInstance.get<Message[]>('http://localhost:4000/send-messages', config);

      // Set the messages in state
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Define handleLogout function to clear access token from local storage and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear access token from local storage
    router.push('/signin'); // Redirect to the login page
  };

  // Return the JSX for the DashboardPage component
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <h2 className="text-xl font-bold mb-2">All Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
        <Link href="/sendmessage">
        <div className="text-blue-500 underline mb-8">Send Message</div>
      </Link>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
