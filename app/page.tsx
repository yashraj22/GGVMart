"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUserAuth } from "./context/AuthContext";
import Products from "./components/Products";

const HomePage = () => {
  const { user, loginWithGoogle, logOut }: any = useUserAuth();

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

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    // Display user's name and avatar if login is successful
    return (
      <div>
        {/* <h1>Posts</h1>
        <div>
          <p>Welcome, {user.user_metadata?.full_name || ""}!</p>
          <Image
            width={50}
            height={50}
            src={user.user_metadata?.picture || ""}
            alt="User avatar"
          />
        </div>
        <button onClick={handleLogout}>LogOut</button> */}
        {/* <ChatUi /> */}

        {/* {chats && (
          <>
            {" "}
            <h2>Chats:</h2>
            <ul>
              {chats.map((chat: any) => (
                <li className="bg-red-300 my-2" key={chat.id}>
                  <p>Chat ID: {chat.id}</p>
                  <p>User ID: {chat.userId}</p>
                  <p>Product ID: {chat.productId}</p>
                 
                </li>
              ))}
            </ul>
          </>
        )} */}

        {/* <ProductForm /> */}
        <Products />
        {/* <p>My Products</p>
        <MyProducts /> */}
      </div>
    );
  }

  // If not logged in, show the login button
  return (
    <div>
      {/* <h1>Posts</h1>
      <button onClick={loginWithGoogle}>Sign in with Google</button>
      <button>My Products</button> */}
    </div>
  );
};

const Home = () => {
  return <HomePage />;
};

export default Home;
