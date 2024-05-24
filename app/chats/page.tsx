"use client";
import React, { useEffect, useState } from "react";
import MyChatScreen from "../components/MyChatScreen";
import { useUserAuth } from "../context/AuthContext";

const MyChats = () => {
  const [chats, setChats] = useState();
  const [Loading, setLoading] = useState(true);
  const { user }: any = useUserAuth();
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const response = await fetch("/api/chats");
  //       const data = await response.json();
  //       setChats(data);
  //     } catch (error) {
  //       console.error("Failed to fetch chats:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchChats();
  // }, []);

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `/api/product/myproduct/${user.identities[0].user_id}`,
          );
          const data = await response.json();
          setProducts(data.products); // Assuming 'data.products' is the array
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    }
  }, [user]);

  const getOwnerId = () => {
    if (products) {
      return products[0].ownerId;
    }
  };

  return <MyChatScreen prop={getOwnerId} />;
};

export default MyChats;
