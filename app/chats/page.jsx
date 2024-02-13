'use client'
import React, { useState, useEffect } from 'react';
import { createChatRoom } from '../util/chatUtils';
const Chats = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [productId, setProductId] = useState('');
    const [sellerId, setSellerId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch('/api/product');
                console.log(data.products[0]);
                const productId = data.products[0].id;
                const sellerId = data.products[0].ownerId;

                setProductId(productId);
                setSellerId(sellerId);

                const roomId = `product_${productId}_seller_${sellerId}`;

                const subscription = prisma.message.findMany({
                    where: {
                        room_id: roomId
                    },
                    orderBy: {
                        created_at: 'asc'
                    }
                }).$subscribe.message((payload) => {
                    setMessages(prevMessages => [...prevMessages, payload]);
                });

                return () => {
                    subscription.unsubscribe();
                };
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchData();
    }, []);

    // Handle message input changes
    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    // Handle sending a message
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Insert message into your messages table
        await createChatRoom();

        setMessage('');
    };

    return (
        <div>
            <h2>Chat with Seller</h2>
            <div>
                <h3>Product Card</h3>
                <p>Product ID: {productId}</p>
                <p>Seller ID: {sellerId}</p>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg.content}</p>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={message} onChange={handleChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chats;
