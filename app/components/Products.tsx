"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ChatWithSeller from "./ChatWithSeller";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        setProducts(data.products); // Assuming 'data.products' is the array
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchProducts();
  }, []);

  const renderSkeletons = () => {
    // Adjust this number to match the grid layout (4 columns per row in this case)
    const skeletonsPerRow = 4;
    const totalSkeletons = skeletonsPerRow * 5; // Create two full rows of skeletons (adjust as needed)

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

  const renderProductCards = () => {
    return products.map((product) => (
      <div key={product.id} className="p-4">
        <div className="rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
          <div className="px-6 py-4 flex-1">
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {product.images.map((image, index) => (
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
                ))}
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
    ));
  };

  return (
    <div className="container mx-auto max-w-7xl p-0 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? renderSkeletons() : renderProductCards()}
    </div>
  );
};

export default Products;
