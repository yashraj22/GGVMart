"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import MyProducts from "../components/MyProducts";
import Image from "next/image";
import { User, Eye, ShoppingBag, LogOut } from "lucide-react";
import Link from "next/link";
import { purgeStore } from "../util/actions";
import { navigate } from "../util/redirect";
import { useDispatch } from "react-redux";
import { useTheme } from "../components/ThemeProvider";

const Profile = () => {
  const { user, logOut }: any = useUserAuth();
  const [checkedProductIds, setCheckedProductIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [hasPostedAds, setHasPostedAds] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      dispatch(purgeStore());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserChats = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/getCurrentUser?userId=${user.id}`);
          const data = await response.json();
          if (response.ok && data.userChats) {
            setCheckedProductIds(data.userChats.map((c: any) => c.productId));
          }
        } catch (error) {
          console.error("Error fetching user chats:", error);
        }
      }
    };
    fetchUserChats();
  }, [user]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!checkedProductIds.length) return;
      try {
        const response = await fetch("/api/getCheckedProducts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: checkedProductIds }),
        });
        const data = await response.json();
        if (response.ok) setProductDetails(data.products);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [checkedProductIds]);

  /* ── Compact product card for "viewed" section ── */
  const ViewedCard = ({ product }: { product: any }) => (
    <Link href={`/ProductDetails?id=${product.id}`}>
      <div
        className="flex items-center gap-3 p-3 rounded-[10px] cursor-pointer transition-all duration-150 group"
        style={{
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = isDark
            ? "rgba(255,255,255,0.15)"
            : "rgba(0,0,0,0.12)";
          (e.currentTarget as HTMLElement).style.background = isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.015)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div
          className="relative w-14 h-14 flex-shrink-0 rounded-[8px] overflow-hidden"
          style={{ background: "var(--ds-gray-200)" }}
        >
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[13px] font-medium truncate"
            style={{ color: "var(--ds-gray-900)" }}
          >
            {product.title}
          </p>
          <p
            className="text-[11.5px] mt-0.5 line-clamp-1"
            style={{ color: "var(--ds-gray-700)" }}
          >
            {product.description}
          </p>
          <p
            className="text-[13px] font-semibold mt-1"
            style={{ color: "var(--ds-gray-900)" }}
          >
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--ds-background-200)" }}
    >
      {/* ── Profile hero ── */}
      <div
        className="relative overflow-hidden border-b"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="absolute inset-0 dot-grid"
          style={{ opacity: 0.35 }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, transparent 60%, #0a0a0a 100%)"
              : "linear-gradient(to bottom, transparent 60%, #fafafa 100%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="flex items-start justify-between gap-4 animate-fade-up">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  border: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}, 0 2px 8px rgba(0,0,0,0.06)`,
                }}
              >
                {user?.user_metadata?.picture ? (
                  <Image
                    src={user.user_metadata.picture}
                    alt="Profile"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#171717] flex items-center justify-center">
                    <User size={28} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1
                  className="text-[20px] font-semibold"
                  style={{
                    color: "var(--ds-gray-900)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {user?.user_metadata?.full_name || "GGV Student"}
                </h1>
                <p
                  className="text-[13px] mt-0.5"
                  style={{ color: "var(--ds-gray-700)" }}
                >
                  {user?.email}
                </p>
                <div
                  className="flex items-center gap-1.5 mt-2 text-[11.5px] font-medium"
                  style={{ color: "#16a34a" }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a]"
                    style={{ boxShadow: "0 0 0 2px rgba(22,163,74,0.2)" }}
                  />
                  GGV Campus Member
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleLogout}
              className="btn-secondary flex-shrink-0"
              style={{
                height: 32,
                paddingInline: 12,
                fontSize: 12.5,
                color: "var(--ds-gray-700)",
              }}
            >
              <LogOut size={12} strokeWidth={2} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        {/* Viewed products */}
        {productDetails.length > 0 && (
          <Section
            icon={
              <Eye
                size={13}
                strokeWidth={2}
                style={{ color: "var(--ds-gray-800)" }}
              />
            }
            label="Recently viewed"
            count={productDetails.length}
            isDark={isDark}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {productDetails.map((product: any, i: number) => (
                <ViewedCard key={i} product={product} />
              ))}
            </div>
          </Section>
        )}

        {/* My listings */}
        <Section
          icon={
            <ShoppingBag
              size={13}
              strokeWidth={2}
              style={{ color: "var(--ds-gray-800)" }}
            />
          }
          label="Your listings"
          isDark={isDark}
        >
          <MyProducts onAdsLoaded={(count) => setHasPostedAds(count > 0)} />
          {!hasPostedAds && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div
                className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                style={{
                  background: "var(--ds-gray-200)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <ShoppingBag
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--ds-gray-600)" }}
                />
              </div>
              <div>
                <p
                  className="text-[13.5px] font-medium"
                  style={{ color: "var(--ds-gray-900)" }}
                >
                  No listings yet
                </p>
                <p
                  className="text-[12.5px] mt-1"
                  style={{ color: "var(--ds-gray-700)" }}
                >
                  Ready to sell something?
                </p>
              </div>
              <Link href="/AddProduct">
                <button
                  className="btn-primary"
                  style={{ height: 34, paddingInline: 14, fontSize: 13 }}
                >
                  List your first item →
                </button>
              </Link>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

const Section = ({
  icon,
  label,
  count,
  children,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  children: React.ReactNode;
  isDark: boolean;
}) => (
  <div
    className="rounded-[14px] overflow-hidden animate-fade-up"
    style={{
      background: "var(--ds-background-100)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
      boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}, 0 2px 12px rgba(0,0,0,0.04)`,
    }}
  >
    <div
      className="flex items-center gap-2 px-5 py-3.5"
      style={{
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      {icon}
      <p
        className="section-label"
        style={{
          textTransform: "none",
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: 0,
          color: "var(--ds-gray-900)",
        }}
      >
        {label}
      </p>
      {count !== undefined && (
        <span
          className="ml-auto text-[11px] font-medium tabular-nums px-2 py-0.5 rounded-full"
          style={{
            background: "var(--ds-gray-200)",
            color: "var(--ds-gray-800)",
          }}
        >
          {count}
        </span>
      )}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default Profile;
