"use client";
import React, { useEffect, useState } from "react";
import { MoreHorizontal, Tag, Trash2, Pencil } from "lucide-react";
import ChatWithSeller from "./ChatWithSeller";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

const MyProducts = ({
  onAdsLoaded,
}: {
  onAdsLoaded: (count: number) => void;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const { user, loading }: any = useUserAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      onAdsLoaded(0);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/product/myproduct/${user.identities[0].user_id}`,
        );
        const data = await response.json();
        const nextProducts = data.products || [];
        setProducts(nextProducts);
        onAdsLoaded(nextProducts.length);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        onAdsLoaded(0);
      }
    };

    fetchProducts();
  }, [loading, user, onAdsLoaded]);

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch("/api/product/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });
      if (response.ok) {
        toast({
          title: "Listing removed",
          className: "bg-green-700 text-white",
        });
        setProducts((p) => p.filter((x) => x.id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          user={user}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

const ProductCard = ({
  product,
  user,
  onDelete,
}: {
  product: any;
  user: any;
  onDelete: (id: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="rounded-[12px] overflow-hidden flex flex-col"
      style={{
        background: "var(--ds-background-100)",
        border: "1px solid rgba(128,128,128,0.1)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(128,128,128,0.14), 0 4px 12px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)"
          : "0 0 0 1px rgba(128,128,128,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition:
          "border-color 150ms ease, box-shadow 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((image: string, i: number) => (
              <CarouselItem key={i}>
                <div className="relative w-full h-[180px]">
                  <Image
                    src={image}
                    alt={`${product.title} — ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    style={{
                      transform: hovered ? "scale(1.04)" : "scale(1)",
                      transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.images.length > 1 && (
            <>
              <CarouselPrevious
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full transition-opacity duration-150"
                style={{
                  background: "rgba(128,128,128,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(128,128,128,0.15)",
                  color: "var(--ds-gray-900)",
                  opacity: hovered ? 1 : 0,
                }}
              />
              <CarouselNext
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full transition-opacity duration-150"
                style={{
                  background: "rgba(128,128,128,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(128,128,128,0.15)",
                  color: "var(--ds-gray-900)",
                  opacity: hovered ? 1 : 0,
                }}
              />
            </>
          )}
        </Carousel>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h2
            className="text-[13.5px] font-semibold leading-snug line-clamp-2 flex-1"
            style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.01em" }}
          >
            {product.title}
          </h2>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 rounded-[6px] flex-shrink-0 transition-all duration-150"
                  style={{
                    color: "#a8a8a8",
                    opacity: hovered ? 1 : 0,
                    background: "transparent",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#171717";
                    (e.currentTarget as HTMLElement).style.background =
                      "#f2f2f2";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#a8a8a8";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-32 p-1 rounded-[10px]"
                style={{
                  border: "1px solid rgba(128,128,128,0.12)",
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.15), 0 16px 40px rgba(0,0,0,0.1)",
                  background: "var(--ds-background-100)",
                  backdropFilter: "blur(20px)",
                }}
                align="end"
              >
                <DropdownMenuItem
                  onClick={() => alert("Edit not implemented")}
                  className="flex items-center gap-2 text-[12.5px] px-2 py-1.5 rounded-[6px] cursor-pointer"
                  style={{ color: "var(--ds-gray-900)" }}
                >
                  <Pencil size={11} />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(product.id)}
                  className="flex items-center gap-2 text-[12.5px] px-2 py-1.5 rounded-[6px] cursor-pointer"
                  style={{ color: "#c00" }}
                >
                  <Trash2 size={11} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <span
          className="badge badge-gray self-start"
          style={{ fontSize: 10.5 }}
        >
          <Tag size={9} />
          {product.category}
        </span>

        <p
          className="text-[12px] leading-relaxed line-clamp-2 flex-grow"
          style={{ color: "var(--ds-gray-700)" }}
        >
          {product.description}
        </p>

        <div
          className="flex items-center justify-between pt-2.5"
          style={{ borderTop: "1px solid rgba(128,128,128,0.08)" }}
        >
          <span
            className="text-[16px] font-semibold"
            style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.02em" }}
          >
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <ChatWithSeller productId={product.id} receiverId={product.ownerId} />
        </div>
      </div>
    </article>
  );
};

export default MyProducts;
