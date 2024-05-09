"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import ChatWithSeller from "./ChatWithSeller";
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
          // Set the products using the 'products' property of the data object
          setProducts(data.products); // Assuming 'data.products' is the array
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    }
  }, [user]);

  return (
    <div className="container mx-auto max-w-7xl p-0 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product: any) => (
        <div key={product.id} className="p-4">
          <div className="rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
            <div className="px-6 py-4 flex-1">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {product.images.map(
                    (
                      image,
                      index, // Changed 'data.products[0].images' to 'product.images'
                    ) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                width={200}
                                height={200}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ),
                  )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <div className="font-bold text-xl mb-2">{product.title}</div>
              <p className="text-gray-700 text-base">
                Category: {product.category}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <ChatWithSeller
                productId={product.id}
                receiverId={product.ownerId}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProducts;
