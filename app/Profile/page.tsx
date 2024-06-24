"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import MyProducts from "../components/MyProducts";
import Image from "next/image";

const Profile = () => {
  const { user }: any = useUserAuth();
  const [userChats, setUserChats] = useState([]);
  const [checkedProductIds, setCheckedProductIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [hasPostedAds, setHasPostedAds] = useState(false);

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

  useEffect(() => {
    fetchProductDetails(checkedProductIds);
  }, [checkedProductIds]);

  const fetchProductDetails = async (productIds) => {
    try {
      const response = await fetch("/api/getCheckedProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      });

      const data = await response.json();
      console.log("Received product details:", data);

      if (response.ok) {
        setProductDetails(data.products);
      } else {
        throw new Error(data.error || "Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Rest of the component remains the same...
  const ProductCard = ({ product }) => (
    <div className="flex items-start p-4 border rounded-lg shadow-sm">
      <div className="w-24 h-24 flex-shrink-0 relative rounded-md overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow ml-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-800 font-semibold">
            ₹ {product.price}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border rounded-lg  overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              You have checked these products:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productDetails.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg overflow-hidden mt-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Ads</h2>
            <MyProducts
              onAdsLoaded={(adsCount) => setHasPostedAds(adsCount > 0)}
            />
            {!hasPostedAds && (
              <p className="text-gray-600">You haven't posted any ads yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
