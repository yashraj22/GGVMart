// Profile directory with page.tsx file
"use client";
import React, { useEffect } from "react";
import { useUserAuth } from "../context/AuthContext";
import MyProducts from "../components/MyProducts";

const Profile = () => {
  const { user }: any = useUserAuth();

  useEffect(() => {
    const fetchAds = async () => {
      if (user) {
        try {
          const response = await fetch(
            `/api/product/${user.identities[0].user_id}`,
          );
          const data = await response.json();
          if (response.ok) {
          } else {
            throw new Error(data.error || "Failed to fetch ads");
          }
        } catch (error) {
          console.error("Error fetching ads:", error);
        }
      }
    };

    fetchAds();
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded overflow-hidden">
          <div className=" mx-5">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mt-5">
              You have checked These products.
            </h2>
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
