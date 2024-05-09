import React, { useState, useEffect } from "react";
import { createChatRoom } from "../util/chatUtils";
// import { PrismaClient } from "@prisma/client"; // Import Prisma client

// const prisma = new PrismaClient(); // Initialize Prisma client
import prisma from "../util/prismaClient";

const Chats = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Array of messages
  const [productId, setProductId] = useState(null); // Product object or null
  const [sellerId, setSellerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch("/api/product");
        const products = await data.json();
        console.log(products[0]);
        const product = products[0];
        const productId = product.id;
        const sellerId = product.ownerId;

        setProductId(productId);
        setSellerId(sellerId);

        const roomId = `product_${productId}_seller_${sellerId}`;

        const subscription = prisma.message
          .findMany({
            // Use Prisma client to fetch messages
            where: {
              room_id: roomId,
            },
            orderBy: {
              created_at: "asc",
            },
          })
          .$subscribe.message((payload: any) => {
            setMessages((prevMessages): any => [...prevMessages, payload]);
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
  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  // Handle sending a message
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Insert message into your messages table
    // await createChatRoom();

    setMessage("");
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
        {messages.map((msg: any, index) => (
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
