// components/Navbar.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";
import { RiMessage2Line } from "react-icons/ri";

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

const Navbar = () => {
  const { user, loginWithGoogle, logOut }: any = useUserAuth();
  const dispatch = useDispatch();

  const { searchQuery, setSearchQuery, resetSearch, setProducts }: any =
    useSearch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchClick = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: searchQuery }), // Use the searchQuery state
      });

      if (!response.ok) {
        const text = await response.text(); // Get the response text
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${text}`,
        );
      }

      const data = await response.json();
      console.log(data);
      setProducts(data.products); // Set the filtered products based on the search query
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
    <nav className="bg-white shadow-md">
      <div className="container mx-auto max-w-7xl flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" onClick={resetSearch}>
            <span className="mr-5 sm:text-lg font-semibold mr-10 text-gray-800">
              <span className="hidden sm:inline">GGVMart</span>
              <span className="sm:hidden">G</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        {/* <ul className="flex space-x-6">
          <li>
            <Link href="/" onClick={resetSearch}>
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
        </ul> */}

        {/* Search Section */}
        <div className="flex items-center border rounded-full px-5 mr-5 flex-grow">
          <div className="flex justify-center items-center flex-grow">
            <RiSearch2Line className="text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search for products ..."
              className=" border-gray-300 outline-none w-full  rounded-md p-2 py-2 mr-2"
            />
          </div>
          {/* <button
            onClick={handleSearchClick}
            className="border border-gray-300 bg-gray-200 rounded-md p-2"
          >
            Search
          </button> */}
        </div>

        {/* User Avatar, Add Product Button and Dropdown */}
        <div className="flex items-center">
          {!user && <button onClick={loginWithGoogle}>Sign In</button>}
          {user && (
            <>
              <Link href="/AddProduct">
                <button className="h-10 w-10 sm:h-10  sm:w-auto  sm:px-8  ml-0 sm:ml-4 mr-2  border border-gray-800 text-gray-800 bg-white rounded-full sm:rounded-full text-xl font-bold">
                  <span className="hidden sm:inline">SELL</span>
                  <span className="sm:hidden">+</span>
                </button>
              </Link>
              <Link href="/chats">
                <button className="h-10 w-10 sm:w-auto sm:px-8 ml-0 sm:ml-4 mr-2 border border-gray-800 text-gray-800 bg-white rounded-full text-xl font-bold py-1 px-8 hidden sm:inline">
                  MyChats
                </button>
                <button className="mr-2 border border-white text-white bg-black rounded-full sm:rounded-lg text-xl font-bold w-10 h-10 flex items-center justify-center sm:hidden">
                  <RiMessage2Line className="text-xl" />
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
