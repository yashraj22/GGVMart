"use client";
import React from "react";
import Image from "next/image";

import { AuthContextProvider, useUserAuth } from "./context/AuthContext";

import ChatUi from "./components/chat";
import Products from "./components/Products";
import ProductForm from "./components/product";

const HomePage = () => {
  const { user, loginWithGoogle, logOut }: any = useUserAuth();

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
        <h1>Posts</h1>
        <div>
          <p>Welcome, {user.user_metadata?.full_name || ""}!</p>
          <Image
            width={50}
            height={50}
            src={user.user_metadata?.picture || ""}
            alt="User avatar"
          />
        </div>
        <button onClick={handleLogout}>LogOut</button>
        <ChatUi />
        <ProductForm />
        <Products />
      </div>
    );
  }

  // If not logged in, show the login button
  return (
    <div>
      <h1>Posts</h1>
      <button onClick={loginWithGoogle}>Sign in with Google</button>
    </div>
  );
};

const Home = () => {
  return (
    <AuthContextProvider>
      <HomePage />
    </AuthContextProvider>
  );
};

export default Home;
