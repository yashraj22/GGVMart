"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChatWithSeller from "../components/ChatWithSeller";
import { Loader2, Tag, CheckCircle2, ArrowLeft, ImageOff } from "lucide-react";
import { useUserAuth } from "@/app/context/AuthContext";
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
import { useTheme } from "../components/ThemeProvider";

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const { loginWithGoogle } = useUserAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSignIn = async () => {
    try {
      await loginWithGoogle();
      setShowAuthAlert(false);
    } catch (error) {
      console.log(error);
    }
  };

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
    if (productId) fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2
          size={20}
          className="animate-spin"
          style={{ color: "var(--ds-gray-600)" }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ImageOff
          size={32}
          strokeWidth={1.5}
          style={{ color: "var(--ds-gray-500)" }}
        />
        <div className="text-center">
          <p
            className="text-[14px] font-medium"
            style={{ color: "var(--ds-gray-900)" }}
          >
            Product not found
          </p>
          <Link
            href="/"
            className="text-[13px] mt-1 inline-block underline underline-offset-2"
            style={{ color: "var(--ds-gray-700)" }}
          >
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen"
        style={{ background: "var(--ds-background-200)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 lg:py-10">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mb-7 text-[13px] transition-colors duration-150 group"
            style={{ color: "var(--ds-gray-700)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--ds-gray-900)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ds-gray-700)")
            }
          >
            <ArrowLeft
              size={13}
              strokeWidth={2}
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
            />
            Marketplace
          </Link>

          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 xl:gap-14 items-start">
            {/* ── Images ── */}
            <div className="space-y-3 animate-fade-up">
              {/* Main image */}
              <div
                className="relative overflow-hidden rounded-[14px]"
                style={{
                  background: "var(--ds-gray-200)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}, 0 2px 8px rgba(0,0,0,0.04)`,
                  aspectRatio: "4/3",
                }}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                  style={{ transition: "opacity 200ms ease" }}
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className="relative flex-shrink-0 rounded-[8px] overflow-hidden transition-all duration-150"
                      style={{
                        width: 64,
                        height: 64,
                        border: `2px solid ${selectedImage === i ? "var(--ds-gray-900)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                        background: "var(--ds-gray-100)",
                        boxShadow:
                          selectedImage === i
                            ? "0 0 0 3px rgba(128,128,128,0.15)"
                            : "none",
                      }}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Details ── */}
            <div className="mt-8 lg:mt-0 space-y-4 animate-fade-up animation-delay-100">
              {/* Category */}
              <span
                className="badge badge-gray"
                style={{ fontSize: 11, paddingBlock: 3, paddingInline: 9 }}
              >
                <Tag size={10} strokeWidth={2} />
                {product.category}
              </span>

              {/* Title */}
              <h1
                className="text-[24px] font-semibold leading-tight"
                style={{
                  color: "var(--ds-gray-900)",
                  letterSpacing: "-0.03em",
                }}
              >
                {product.title}
              </h1>

              {/* Price card */}
              <div
                className="rounded-[12px] p-5 space-y-4"
                style={{
                  background: "var(--ds-background-100)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                  boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}, 0 2px 8px rgba(0,0,0,0.04)`,
                }}
              >
                <div>
                  <p className="section-label mb-1.5">Price</p>
                  <p
                    className="text-[28px] font-bold tracking-tight"
                    style={{
                      color: "var(--ds-gray-900)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                </div>

                <div
                  className="flex items-center gap-1.5 text-[12.5px] font-medium"
                  style={{ color: "#16a34a" }}
                >
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  Available · Listed just now
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                    paddingTop: 16,
                  }}
                >
                  <ChatWithSeller
                    productId={product.id}
                    receiverId={product.ownerId}
                    onAuthRequired={() => setShowAuthAlert(true)}
                    large
                  />
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div
                  className="rounded-[12px] p-5"
                  style={{
                    background: "var(--ds-background-100)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                    boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                  }}
                >
                  <p className="section-label mb-3">Description</p>
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: "var(--ds-gray-800)" }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* Safety note */}
              <p
                className="text-[11.5px] leading-relaxed px-1"
                style={{ color: "var(--ds-gray-600)" }}
              >
                💡 Meet the seller on campus in a safe, public place. Never
                share personal financial information.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent
          className="max-w-[360px] rounded-[14px] p-6"
          style={{
            background: "var(--ds-background-100)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.15), 0 32px 64px rgba(0,0,0,0.1)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="text-[15px] font-semibold"
              style={{ color: "var(--ds-gray-900)" }}
            >
              Sign in required
            </AlertDialogTitle>
            <AlertDialogDescription
              className="text-[13px]"
              style={{ color: "var(--ds-gray-800)" }}
            >
              You need to sign in to chat with the seller.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="btn-secondary flex-1 h-9 rounded-[8px] text-[13px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignIn}
              className="btn-primary flex-1 h-9 rounded-[8px] text-[13px]"
            >
              Sign in
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2
            size={20}
            className="animate-spin"
            style={{ color: "var(--ds-gray-600)" }}
          />
        </div>
      }
    >
      <ProductDetails />
    </Suspense>
  );
}
