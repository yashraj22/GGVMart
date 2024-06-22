"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChatWithSeller from "../components/ChatWithSeller";
import { Loader2 } from "lucide-react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/SingleProduct/${productId}`);
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Product not found
      </div>
    );
  }

  const plusMinusButton =
    "flex h-8 w-8 cursor-pointer items-center justify-center border duration-100 hover:bg-neutral-100 focus:ring-2 focus:ring-gray-500 active:ring-2 active:ring-gray-500";

  return (
    <section className="container flex-grow mx-auto max-w-[1200px] border-b py-5 lg:grid lg:grid-cols-2 lg:py-10">
      <div className="container mx-auto px-4">
        <div
          className="mb-4 relative bg-gray-100 w-full rounded-lg overflow-hidden"
          style={{ paddingBottom: "100%" }}
        >
          <Image
            src={product.images[selectedImage]}
            alt={`Product Image ${selectedImage + 1}`}
            className="object-contain"
            layout="fill"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`cursor-pointer border-2 p-1 rounded-lg flex-shrink-0 transition-all duration-200 ${
                selectedImage === index
                  ? "border-blue-500 scale-105"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
                width={80}
                height={80}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto px-5 lg:px-5">
        <h2 className="pt-3 text-2xl font-bold lg:pt-0">{product.title}</h2>
        <div className="mt-1">
          <div className="flex items-center">
            <Rater
              // style={{ fontSize: "20px" }}
              total={5}
              interactive={false}
              rating={3.5}
            />
            <p className="ml-3 text-sm text-gray-400">(150 reviews)</p>
          </div>
        </div>
        <p className="mt-5 font-bold">
          Availability: <span className="text-green-600">In Stock</span>
        </p>
        <p className="font-bold">
          Category: <span className="font-normal">{product.category}</span>
        </p>
        <p className="mt-4 text-4xl font-bold text-violet-900">
          ₹{product.price}
        </p>
        <p className="pt-5 text-sm leading-5 text-gray-500">
          {product.description}
        </p>

        <div className="mt-6">
          <p className="pb-2 text-xs text-gray-500">Quantity</p>
          <div className="flex">
            <button
              className={plusMinusButton}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </button>
            <div className="flex h-8 w-8 cursor-text items-center justify-center border-t border-b active:ring-gray-500">
              {quantity}
            </div>
            <button
              className={plusMinusButton}
              onClick={() => setQuantity(quantity + 1)}
            >
              {" "}
              +
            </button>
          </div>
        </div>
        <div className="mt-7 flex flex-row items-center gap-6">
          <button className="flex h-12 w-1/3 items-center justify-center bg-violet-900 text-white duration-100 hover:bg-blue-800">
            <BiShoppingBag className="mx-2" />
            Add to cart
          </button>
          <button className="flex h-12 w-1/3 items-center justify-center bg-amber-400 duration-100 hover:bg-yellow-300">
            <AiOutlineHeart className="mx-2" />
            Wishlist
          </button>
        </div>
        <div className="mt-7">
          <ChatWithSeller productId={product.id} receiverId={product.ownerId} />
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <ProductDetails />
    </Suspense>
  );
}
