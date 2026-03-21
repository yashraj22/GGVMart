"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "./context/AuthContext";
import Products from "./components/Products";
import { useSearch } from "./context/SearchContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store/store";
import { fetchData } from "./redux/store/dataSlice";
import supabase from "./util/supabaseClient";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Tag } from "lucide-react";

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Smartphones", value: "Smartphones" },
  { label: "Electronics", value: "Electronics" },
  { label: "Household", value: "Households" },
  { label: "Stationary", value: "Stationary" },
  { label: "Others", value: "Others" },
];

const HomePage = () => {
  const { user }: any = useUserAuth();
  const { products, setProducts } = useSearch();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (user) {
      const getIdFetch = async () => {
        const { data } = await supabase.auth.getSession();
        const id: any = data.session?.user.id;
        if (id) dispatch(fetchData({ userId: id }));
      };
      getIdFetch();
    }
    fetchProducts();
  }, [user, dispatch]);

  const handleCategory = async (cat: string | null) => {
    setActiveCategory(cat);
    try {
      const url = cat
        ? `/api/product?category=${encodeURIComponent(cat)}`
        : "/api/product";
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error filtering:", error);
    }
  };

  const filtered = activeCategory
    ? (products || []).filter((p: any) => p.category === activeCategory)
    : products;

  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 dot-grid"
          style={{ opacity: 0.5 }}
          aria-hidden="true"
        />
        {/* Gradient beam overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,114,245,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        {/* Fade out bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-24"
          style={{
            background: "linear-gradient(to bottom, transparent, #fafafa)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-12">
          {/* Campus badge */}
          <div className="flex justify-center mb-5 animate-fade-in">
            <span
              className="badge badge-gray"
              style={{
                gap: 6,
                paddingInline: 10,
                paddingBlock: 4,
                fontSize: 11,
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a]"
                style={{ boxShadow: "0 0 0 2px rgba(22,163,74,0.2)" }}
              />
              GGV Campus Marketplace
            </span>
          </div>

          {/* Headline */}
          <div className="text-center space-y-3 animate-fade-up">
            <h1
              className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.04em] leading-[1.1]"
              style={{ color: "#171717" }}
            >
              Buy &amp; sell on campus, <br className="hidden sm:block" />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6f6f6f 0%, #171717 50%, #6f6f6f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                effortlessly.
              </span>
            </h1>
            <p
              className="text-[15px] leading-relaxed max-w-md mx-auto animate-fade-up animation-delay-100"
              style={{ color: "#6f6f6f" }}
            >
              The trusted second-hand marketplace for GGV students. Find great
              deals or list your items in seconds.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-3 mt-7 animate-fade-up animation-delay-200">
            <Link href="/AddProduct">
              <button
                className="btn-primary"
                style={{
                  height: 38,
                  paddingInline: 16,
                  fontSize: 13.5,
                  borderRadius: 9,
                }}
              >
                <ShoppingBag size={14} />
                List an item
                <ArrowRight size={13} style={{ opacity: 0.6 }} />
              </button>
            </Link>
            <a
              href="#listings"
              className="btn-secondary"
              style={{
                height: 38,
                paddingInline: 16,
                fontSize: 13.5,
                borderRadius: 9,
              }}
            >
              Browse listings
            </a>
          </div>
        </div>
      </section>

      {/* ── Category filter pills ── */}
      <section
        className="sticky border-b z-40"
        style={{
          top: 52,
          background: "rgba(250,250,250,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.06)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = cat.value === activeCategory;
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategory(cat.value)}
                  className="flex-shrink-0 rounded-[8px] px-3 py-1.5 text-[12.5px] font-medium transition-all duration-150"
                  style={{
                    background: isActive ? "#171717" : "transparent",
                    color: isActive ? "#fff" : "#6f6f6f",
                    border: `1px solid ${isActive ? "#171717" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Listings ── */}
      <section id="listings">
        <Products prod={filtered} />
      </section>
    </div>
  );
};

export default function Home() {
  return <HomePage />;
}
