"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LuSettings2 } from "react-icons/lu";
import ChatWithSeller from "./ChatWithSeller";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { useUserAuth } from "../context/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const { user }: any = useUserAuth();

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/product/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }), // Send the product ID in the body
      });
      if (response.ok) {
        // Successfully deleted the product, update state to remove the product card
        toast({
          title: "Product Deleted",
          description: "Your product has been successfully Deleted.",
          className: "bg-green-500",
        });

        setProducts(products.filter((product) => product.id !== productId));
      } else {
        // Handle cases where the server responds with an error
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete the product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
    return products.map((product) => (
      <div key={product.id} className="p-4 flex flex-col">
        <Card className=" w-64 bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-20 object-cover"
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
              <div className="flex justify-between">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                {/* {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <LuSettings2 />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuItem
                        onClick={() =>
                          alert("Edit functionality not implemented")
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )} */}
              </div>
              <div className="flex justify-start items-center mb-4 space-x-2">
                <span className="text-xs text-gray-500">Category:</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 h-4 rounded-full">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-400 text-xs font-normal mb-4">
                {" "}
                {product.description}{" "}
              </p>
            </div>

            <div className="flex justify-between items-center mt-2">
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
    ));
  };

  return (
    // <div className="container mx-auto max-w-7xl p-0 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div className="flex flex-col items-center mt-6">
      {renderProductCards()}
    </div>
    // </div>
  );
};

export default ProductCards;
