"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ChatWithSeller from "../../components/ChatWithSeller";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);

  const renderSkeletons = () => {
    const skeletonsPerRow = 4;
    const totalSkeletons = skeletonsPerRow * 5;

    return Array.from({ length: totalSkeletons }).map((_, index) => (
      <div key={index} className="p-4">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/SingleProduct/${productId}`);
        const data = await response.json();
        setProduct(data.product); // Update this line
        console.log(data.product); // Update this line
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        {renderSkeletons()}
      </div>
    );
  }

  return (
    <div>
      <Card className="max-w-sm bg-[#fafafa] shadow-sm rounded-sm overflow-hidden h-full flex flex-col">
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
        <CardContent className="flex flex-col justify-between h-full p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {product.title}
            </h1>
            <div className="flex justify-start items-center mb-4 space-x-2">
              <span className="text-xs text-gray-500">Category:</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 h-4 rounded-full">
                {product.category}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-light mb-4">
              {product.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-10">
            <h1 className="text-xl font-semibold text-gray-800">
              ₹ {product.price}
            </h1>
            <ChatWithSeller
              productId={product.id}
              receiverId={product.ownerId}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails />
    </Suspense>
  );
}
