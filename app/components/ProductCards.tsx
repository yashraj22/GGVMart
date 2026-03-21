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
        <div className="w-12 h-12 bg-[#f2f2f2] rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={20} className="text-[#a8a8a8]" />
        </div>
        <p className="text-sm font-medium text-[#171717]">No products</p>
        <p className="text-sm text-[#8f8f8f] mt-1">
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
          className="group w-full max-w-xs bg-white border border-[#e2e2e2] rounded-lg overflow-hidden hover:border-[#c9c9c9] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col cursor-pointer"
        >
          <div className="relative overflow-hidden bg-[#fafafa]">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-48">
                      <Image
                        src={image}
                        alt={`${product.title} — Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm border border-[#e2e2e2] text-[#171717] rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm border border-[#e2e2e2] text-[#171717] rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100" />
            </Carousel>
          </div>

          <div className="flex flex-col flex-grow p-4 gap-3">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-[#171717] leading-snug">
                {product.title}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f2f2f2] text-[#6f6f6f] text-xs font-medium rounded-full">
                <Tag size={10} />
                {product.category}
              </span>
              <p className="text-xs text-[#8f8f8f] leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#f2f2f2]">
              <span className="text-base font-semibold text-[#171717]">
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
