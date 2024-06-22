"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ChatWithSeller from "./ChatWithSeller";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const Products = ({ prod }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (prod) {
      setProducts(prod.reverse()); // Reverse the order of products
      setLoading(false); // Stop loading once data is set
    } else {
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/product");
          const data = await response.json();
          setProducts(data.products.reverse()); // Reverse the order of products
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false); // Stop loading once data is fetched
        }
      };

      fetchProducts();
    }
  }, [prod]);

  const handleCardClick = (productId) => {
    router.push(`/ProductDetails/${productId}`);
  };

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

  const renderProductCards = () => {
    if (products.length === 0) {
      return (
        <h1 className="text-2xl font-semibold text-gray-800 text-center mt-10">
          No products found
        </h1>
      );
    }
    return products.map((product, index) => (
      <Link key={product.id} href={`/ProductDetails?id=${product.id}`}>
        <div
          className={`p-2 flex justify-center items-center sm:justify-start`}
        >
          <Card className="w-full  sm:max-w-sm bg-[#fafafa] shadow-sm rounded-sm overflow-hidden h-full flex flex-col sm:flex-col">
            <div className="relative w-full">
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
      </Link>
    ));
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-0 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? renderSkeletons() : renderProductCards()}
    </div>
  );
};

export default Products;
