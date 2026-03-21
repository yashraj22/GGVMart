// components/Navbar.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MessageCircle, User, Plus, Sun, Moon } from "lucide-react";
import { useUserAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearch } from "../context/SearchContext";
import { purgeStore } from "../util/actions";
import { navigate } from "../util/redirect";
import { useDispatch } from "react-redux";
import { useTheme } from "./ThemeProvider";

const Navbar = () => {
  const { user, loginWithGoogle, logOut }: any = useUserAuth();
  const dispatch = useDispatch();
  const { searchQuery, setSearchQuery, resetSearch, setProducts }: any =
    useSearch();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchClick();
  };

  const handleSearchClick = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery }),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      dispatch(purgeStore());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Frosted glass bar */}
      <div
        className="relative border-b"
        style={{
          background: isDark ? "rgba(10,10,10,0.85)" : "rgba(250,250,250,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-[52px] items-center justify-between gap-4">
            {/* ── Logo ── */}
            <Link
              href="/"
              onClick={resetSearch}
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              {/* Logo mark */}
              <div
                className="relative flex items-center justify-center w-[26px] h-[26px] rounded-[6px] overflow-hidden"
                style={{
                  background: "#000",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.08) inset, 0 1px 2px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  className="text-white font-bold text-[13px] tracking-tighter select-none"
                  style={{ fontFeatureSettings: '"ss01"' }}
                >
                  G
                </span>
              </div>
              <span
                className="hidden sm:block text-[14px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--ds-gray-900)" }}
              >
                GGVMart
              </span>
            </Link>

            {/* ── Search ── */}
            <div className="flex-1 max-w-[360px]">
              <div className="relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  size={13}
                  strokeWidth={2}
                  style={{ color: "var(--ds-gray-600)" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search products..."
                  className="w-full h-[34px] pl-[34px] pr-3 text-[13px] rounded-[8px] transition-all duration-150 outline-none"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                    color: "var(--ds-gray-900)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#fff";
                    e.currentTarget.style.borderColor = isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.2)";
                    e.currentTarget.style.boxShadow = isDark
                      ? "0 0 0 3px rgba(255,255,255,0.06)"
                      : "0 0 0 3px rgba(0,0,0,0.06)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Theme toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="relative w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  color: "var(--ds-gray-700)",
                  background: "transparent",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                {isDark ? (
                  <Sun size={13} strokeWidth={2} />
                ) : (
                  <Moon size={13} strokeWidth={2} />
                )}
              </button>

              {!user && (
                <button
                  id="sign-in-btn"
                  onClick={loginWithGoogle}
                  className="btn-primary"
                  style={{ height: 32, padding: "0 12px", fontSize: 13 }}
                >
                  <User size={13} strokeWidth={2} />
                  <span className="hidden xs:inline">Sign in</span>
                </button>
              )}

              {user && (
                <>
                  <Link href="/AddProduct">
                    <button
                      id="sell-btn"
                      className="btn-primary"
                      style={{ height: 32, padding: "0 10px", fontSize: 13 }}
                    >
                      <Plus size={13} strokeWidth={2.5} />
                      <span className="hidden sm:inline">Sell</span>
                    </button>
                  </Link>

                  <Link href="/chats">
                    <button
                      id="chats-btn"
                      className="btn-secondary"
                      style={{ height: 32, padding: "0 10px", fontSize: 13 }}
                    >
                      <MessageCircle size={13} strokeWidth={2} />
                      <span className="hidden sm:inline">Chats</span>
                    </button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        id="user-avatar-btn"
                        className="relative w-[28px] h-[28px] rounded-full overflow-hidden outline-none transition-all duration-150"
                        style={{
                          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                          boxShadow: "0 0 0 0px rgba(0,0,0,0.1)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 0 3px rgba(128,128,128,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 0 0px rgba(0,0,0,0.08)";
                        }}
                      >
                        {user.user_metadata?.picture ? (
                          <Image
                            src={user.user_metadata.picture}
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#171717] flex items-center justify-center">
                            <User size={13} className="text-white" />
                          </div>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-44 p-1 rounded-[10px]"
                      style={{
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        boxShadow: isDark
                          ? "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.4)"
                          : "0 0 0 1px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)",
                        background: isDark
                          ? "rgba(17,17,17,0.97)"
                          : "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                      }}
                      align="end"
                      sideOffset={8}
                    >
                      <DropdownMenuLabel
                        className="px-2 py-1.5 text-[11px] font-medium select-none"
                        style={{ color: "var(--ds-gray-700)" }}
                      >
                        {user.email?.split("@")[0]}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.06)",
                        }}
                      />
                      <DropdownMenuItem
                        onSelect={() => navigate("/Profile")}
                        className="text-[13px] px-2 py-1.5 rounded-[6px] cursor-pointer"
                        style={{ color: "var(--ds-gray-900)", outline: "none" }}
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.06)",
                        }}
                      />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-[13px] px-2 py-1.5 rounded-[6px] cursor-pointer"
                        style={{ color: "#e05252", outline: "none" }}
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
