"use client";
import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        const token = localStorage.getItem('accessToken');

        if (userData && userData.email && token) {
            setUserEmail(userData.email);
            setAccessToken(token);

            const pusher = new Pusher('b8c7db949ba052d945a4', { cluster: 'ap2' });
            const channel = pusher.subscribe(`private-${userData.email}`);
            channel.bind('new-message', (data) => {
                if (data.sender && data.sender.email) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                } else {
                    console.error('Received message with invalid sender data:', data);
                }
            });

            return () => {
                channel.unbind_all();
                channel.unsubscribe();
            };
        } else {
            console.error("User data or access token is missing from localStorage.");
        }
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (userEmail && recipientEmail && accessToken) {
                try {
                    const response = await axios.get(
                        `http://localhost:4000/buser/messages?receiverEmail=${recipientEmail}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    if (response.data.every(msg => msg.sender && msg.sender.email)) {
                        setMessages(response.data);
                        scrollToBottom();
                    } else {
                        console.error('Invalid message data received:', response.data);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };
        
        fetchMessages();
    }, [userEmail, recipientEmail, accessToken]);

    const sendMessage = async () => {
        if (!userEmail || !recipientEmail || !newMessage.trim() || !accessToken) {
            console.error("Required fields are missing:", { userEmail, recipientEmail, newMessage, accessToken });
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:4000/buser/send-message',
                { receiverEmail: recipientEmail, content: newMessage.trim() },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (response.data.sender && response.data.sender.email) {
                setMessages(prevMessages => [...prevMessages, response.data]);
                setNewMessage('');
                scrollToBottom();
            } else {
                console.error('Sent message with invalid sender data:', response.data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };



    return (
        <AuthLayout>
            <div className="chat-container flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Chat</h1>
                <div className="messages-container bg-gray-200 p-4 rounded-md mb-4 w-full max-w-md overflow-auto">
                    <ul>
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`p-2 rounded-md mb-2 ${
                                    msg.sender.email === userEmail ? 'bg-blue-200 ml-auto' : 'bg-green-200'
                                }`}
                            >
                                <span className="font-bold">{msg.sender.name}:</span> {msg.content}
                            </li>
                        ))}
                    </ul>
                    <div ref={messagesEndRef} />
                </div>
                <input
                    type="text"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email..."
                    className="input input-bordered w-full max-w-md mb-2"
                />
                <div className="flex w-full max-w-md">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input input-bordered w-full"
                    />
                    <button onClick={sendMessage} className="btn btn-primary ml-2">
                        Send
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Chat;
