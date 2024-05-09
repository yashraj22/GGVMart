// components/Navbar.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, loginWithGoogle, logOut }: any = useUserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto max-w-7xl flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-lg font-semibold text-gray-800">GGVMart</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link href="/">
              <p className="text-gray-600 hover:text-blue-600">Home</p>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <p className="text-gray-600 hover:text-blue-600">About</p>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <p className="text-gray-600 hover:text-blue-600">Contact</p>
            </Link>
          </li>
        </ul>

        {/* User Avatar, Add Product Button and Dropdown */}
        <div className="flex items-center">
          {!user && <button onClick={loginWithGoogle}>Sign In</button>}
          {user && (
            <>
              <Link href="/AddProduct">
                <button className="ml-4 mr-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add Product
                </button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={user.user_metadata?.picture || ""}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/Profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
