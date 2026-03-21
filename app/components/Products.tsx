"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ChatWithSeller from "./ChatWithSeller";
import { useUserAuth } from "@/app/context/AuthContext";
import { useDispatch } from "react-redux";
import { purgeStore } from "../util/actions";
import { navigate } from "../util/redirect";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tag, PackageOpen } from "lucide-react";

/* ── Skeleton ─────────────────────────────────────────── */
const ProductSkeleton = () => (
  <div
    className="rounded-[12px] overflow-hidden"
    style={{
      background: "var(--ds-background-100)",
      border: "1px solid rgba(128,128,128,0.1)",
      boxShadow: "0 0 0 1px rgba(128,128,128,0.04)",
    }}
  >
    <div className="h-[200px] skeleton" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-[13px] w-3/4" />
      <div className="skeleton h-[11px] w-1/3" style={{ borderRadius: 999 }} />
      <div className="space-y-1.5 pt-1">
        <div className="skeleton h-[11px] w-full" />
        <div className="skeleton h-[11px] w-4/5" />
      </div>
      <div
        className="flex justify-between items-center pt-3"
        style={{ borderTop: "1px solid rgba(128,128,128,0.07)" }}
      >
        <div className="skeleton h-5 w-14" />
        <div className="skeleton h-8 w-16 rounded-[8px]" />
      </div>
    </div>
  </div>
);

/* ── Empty State ───────────────────────────────────────── */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center">
    <div
      className="w-14 h-14 rounded-[12px] flex items-center justify-center"
      style={{
        background: "var(--ds-gray-100)",
        border: "1px solid rgba(128,128,128,0.1)",
        boxShadow: "0 0 0 1px rgba(128,128,128,0.05)",
      }}
    >
      <PackageOpen
        size={22}
        strokeWidth={1.5}
        style={{ color: "var(--ds-gray-600)" }}
      />
    </div>
    <div>
      <p
        className="text-[14px] font-medium"
        style={{ color: "var(--ds-gray-900)" }}
      >
        No listings yet
      </p>
      <p className="text-[13px] mt-1" style={{ color: "var(--ds-gray-700)" }}>
        Be the first to list something!
      </p>
    </div>
  </div>
);

/* ── Product Card ──────────────────────────────────────── */
const ProductCard = ({
  product,
  index,
  onAuthRequired,
}: {
  product: any;
  index: number;
  onAuthRequired: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const delay = Math.min(index * 40, 320);

  return (
    <article
      className="animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--ds-background-100)",
        border: "1px solid rgba(128,128,128,0.1)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(128,128,128,0.14), 0 4px 12px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)"
          : "0 0 0 1px rgba(128,128,128,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition:
          "border-color 150ms ease, box-shadow 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link
        href={`/ProductDetails?id=${product.id}`}
        className="block"
        tabIndex={-1}
      >
        <div
          className="relative overflow-hidden"
          style={{ background: "var(--ds-gray-100)", height: 200 }}
        >
          <Carousel className="w-full h-full">
            <CarouselContent>
              {product.images.map((image: string, i: number) => (
                <CarouselItem key={i}>
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={image}
                      alt={`${product.title} image ${i + 1}`}
                      fill
                      className="object-cover"
                      style={{
                        transform: hovered ? "scale(1.04)" : "scale(1)",
                        transition:
                          "transform 400ms cubic-bezier(0.16,1,0.3,1)",
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
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
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
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </>
            )}
          </Carousel>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-grow p-4 gap-2.5">
        {/* Category */}
        <div className="flex items-center gap-1.5">
          <span
            className="badge badge-gray"
            style={{ fontSize: 10.5, paddingBlock: 2, paddingInline: 7 }}
          >
            <Tag size={9} strokeWidth={2} />
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link href={`/ProductDetails?id=${product.id}`}>
          <h2
            className="text-[13.5px] font-semibold leading-snug line-clamp-2 transition-colors duration-150"
            style={{
              color: hovered ? "var(--ds-gray-1000)" : "var(--ds-gray-900)",
              letterSpacing: "-0.01em",
            }}
          >
            {product.title}
          </h2>
        </Link>

        {/* Description */}
        <p
          className="text-[12px] leading-relaxed line-clamp-2 flex-grow"
          style={{ color: "var(--ds-gray-700)" }}
        >
          {product.description}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 mt-auto"
          style={{ borderTop: "1px solid rgba(128,128,128,0.08)" }}
        >
          <div>
            <span
              className="text-[16px] font-semibold tracking-tight"
              style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.02em" }}
            >
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          </div>
          <ChatWithSeller
            productId={product.id}
            receiverId={product.ownerId}
            onAuthRequired={onAuthRequired}
          />
        </div>
      </div>
    </article>
  );
};

/* ── Products Grid ─────────────────────────────────────── */
const Products = ({ prod }: { prod?: any[] }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { loginWithGoogle } = useUserAuth();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      await loginWithGoogle();
      setShowAuthAlert(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (prod !== undefined) {
      setProducts((prod || []).slice().reverse());
      setLoading(false);
    } else {
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/product");
          const data = await response.json();
          setProducts(data.products.reverse());
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [prod]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Section header */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <p className="section-label">Listings</p>
              <span
                className="text-[11px] font-medium tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--ds-gray-200)",
                  color: "var(--ds-gray-800)",
                  border: "1px solid rgba(128,128,128,0.1)",
                }}
              >
                {products.length}
              </span>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAuthRequired={() => setShowAuthAlert(true)}
              />
            ))
          )}
        </div>
      </div>

      {/* Auth dialog */}
      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent
          className="max-w-[360px] rounded-[14px] p-6"
          style={{
            background: "var(--ds-background-100)",
            border: "1px solid rgba(128,128,128,0.1)",
            boxShadow:
              "0 0 0 1px rgba(128,128,128,0.06), 0 8px 24px rgba(0,0,0,0.15), 0 32px 64px rgba(0,0,0,0.1)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="text-[15px] font-semibold"
              style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.01em" }}
            >
              Sign in required
            </AlertDialogTitle>
            <AlertDialogDescription
              className="text-[13px] mt-1"
              style={{ color: "var(--ds-gray-800)" }}
            >
              Sign in to chat with the seller and start a conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2">
            <AlertDialogCancel
              className="btn-secondary flex-1 h-9 rounded-[8px] text-[13px]"
              style={{ border: "1px solid rgba(0,0,0,0.1)" }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignIn}
              className="btn-primary flex-1 h-9 rounded-[8px] text-[13px]"
              style={{ background: "#171717" }}
            >
              Sign in with Google
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Products;
