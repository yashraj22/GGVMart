"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChatWithSeller from "../components/ChatWithSeller";

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/SingleProduct/${productId}`);
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex p-10 space-x-8">
      <div className="w-1/2 flex flex-col">
        <div
          className="mb-4 relative bg-gray-100"
          style={{ height: "360px", width: "640px" }}
        >
          <Image
            src={product.images[selectedImage]}
            alt={`Product Image ${selectedImage + 1}`}
            className="object-contain"
            layout="fill"
          />
        </div>

        <div className="flex overflow-x-auto gap-2">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className="cursor-pointer border-2 p-1 border-transparent hover:border-blue-500 rounded-lg"
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md"
                width={96}
                height={96}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.title}
          </h1>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <p className="text-gray-600 text-base mb-6">{product.description}</p>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              ₹{product.price}
            </h2>
            <ChatWithSeller
              productId={product.id}
              receiverId={product.ownerId}
            />
          </div>
        </div>
      </div>
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
