"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import MyProducts from "../components/MyProducts";

const Profile = () => {
  const { user }: any = useUserAuth();
  const [userChats, setUserChats] = useState([]);
  const [checkedProductIds, setCheckedProductIds] = useState([]);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`/api/getCurrentUser?userId=${user.id}`);
          const data = await response.json();
          console.log("Received data:", data); // Log the received data

          if (response.ok && data.userChats) {
            setUserChats(data.userChats);
            console.log("User chats:", data.userChats); // Log the user chats

            const productIds = data.userChats.map((chat) => chat.productId);
            setCheckedProductIds(productIds);
          } else {
            throw new Error(data.error || "Failed to fetch user chats");
          }
        } catch (error) {
          console.error("Error fetching user chats:", error);
        }
      }
    };

    fetchUserChats();
  }, [user]);

  // Rest of the component remains the same...

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded overflow-hidden">
          <div className="mx-5">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mt-5">
              You have checked these products:
            </h2>
            <ul>
              {userChats.map((chat, index) => (
                <li key={index}>Product ID: {chat.productId}</li>
              ))}
            </ul>
          </div>
          <MyProducts />
        </div>
        <div className="bg-white rounded overflow-hidden">
          <div className=" mx-5">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mt-5">
              Your Ads
            </h2>
          </div>
          <MyProducts />
        </div>
      </div>
    </div>
  );
};

export default Profile;
