"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useUserAuth } from "../context/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const { user }: any = useUserAuth();

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

  const renderProductCards = () => {
    return products.map((product: any) => (
      <div key={product.id} className="p-4">
        <Card className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-40 object-cover"
                      width={320}
                      height={160}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200" />
              <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200" />
            </Carousel>
          </div>
          <CardContent className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-gray-600 mb-4">Its {product.condition} used.</p>
            <div className="flex justify-start items-center mb-4 space-x-2">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Electronics
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {product.price} Rupee
              </h1>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  // Add functionality to open message/chat window
                  // Modify this as per your routing or chat opening logic
                }}
              >
                Messages
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    ));
  };

  return (
    <div className="container mx-auto max-w-7xl p-0 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {renderProductCards()}
    </div>
  );
};

export default MyProducts;
