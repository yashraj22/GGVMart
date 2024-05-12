"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUserAuth } from "./context/AuthContext";
import Products from "./components/Products";

const HomePage = () => {
  const { user }: any = useUserAuth();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const response = await fetch("/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          });
          const data = await response.json();
          if (response.ok) {
            setChats(data.userChats);
            console.log("=================data.userChats===================");
            console.log(data.userChats);
            console.log("================data.userChats====================");
          } else {
            console.error("Failed to fetch chats:", data.error);
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        } finally {
        }
      }
    };

    fetchChats();
    console.log(user);
  }, [user]);

  if (user) {
    return (
      <>
        <div className="container mx-auto max-w-7xl flex items-center justify-between p-4"></div>
        <Products />
      </>
    );
  }

  return <div></div>;
};

const Home = () => {
  return <HomePage />;
};

export default Home;
