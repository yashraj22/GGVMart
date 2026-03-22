"use client";
import React, { useEffect, useState } from "react";
import ChatWithSeller from "./ChatWithSeller";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { fetchChatData } from "../redux/store/chatSlice";
import { Tag, ShoppingBag } from "lucide-react";

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const productdata = useSelector(
    (state: RootState) => state.data.product.data,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (productdata) setProducts(productdata);
  }, [productdata]);

  const handleClick = (id: string) => {
    dispatch(fetchChatData({ productId: id }));
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--ds-gray-200)" }}
        >
          <ShoppingBag size={20} style={{ color: "var(--ds-gray-600)" }} />
        </div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--ds-gray-900)" }}
        >
          No products
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--ds-gray-700)" }}>
          No products found for this selection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {products.map((product) => (
        <article
          key={product.id}
          onClick={() => handleClick(product.id)}
          className="group w-full max-w-xs rounded-lg overflow-hidden transition-all duration-200 flex flex-col cursor-pointer"
          style={{
            background: "var(--ds-background-100)",
            border: "1px solid var(--ds-gray-400)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-48">
                      <Image
                        src={image}
                        alt={`${product.title} — Image ${index + 1}`}
                        fill
                        sizes="320px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                style={{
                  background: "rgba(128,128,128,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--ds-gray-400)",
                  color: "var(--ds-gray-900)",
                }}
              />
              <CarouselNext
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                style={{
                  background: "rgba(128,128,128,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--ds-gray-400)",
                  color: "var(--ds-gray-900)",
                }}
              />
            </Carousel>
          </div>

          <div className="flex flex-col flex-grow p-4 gap-3">
            <div className="space-y-2">
              <h2
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--ds-gray-900)" }}
              >
                {product.title}
              </h2>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
                style={{
                  background: "var(--ds-gray-200)",
                  color: "var(--ds-gray-800)",
                }}
              >
                <Tag size={10} />
                {product.category}
              </span>
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: "var(--ds-gray-700)" }}
              >
                {product.description}
              </p>
            </div>
            <div
              className="flex items-center justify-between pt-2"
              style={{ borderTop: "1px solid var(--ds-gray-200)" }}
            >
              <span
                className="text-base font-semibold"
                style={{ color: "var(--ds-gray-900)" }}
              >
                ₹{product.price}
              </span>
              <ChatWithSeller
                productId={product.id}
                receiverId={product.ownerId}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProductCards;
