"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "./context/AuthContext";
import Products from "./components/Products";
import { useSearch } from "./context/SearchContext";

const HomePage = () => {
  const { user }: any = useUserAuth();

  const { searchQuery, setSearchQuery, products, setProducts } = useSearch();

  const [chats, setChats] = useState([]);
  

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const response = await fetch("/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          });
          const data = await response.json();
          if (response.ok) {
            setChats(data.userChats);
            console.log("=================data.userChats===================");
            console.log(data.userChats);
            console.log("================data.userChats====================");
          } else {
            console.error("Failed to fetch chats:", data.error);
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }
    };

    fetchChats();
    console.log(user);

    // Initial fetch for all products
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        setProducts(data.products); // Set the initial product list
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [user]);

  if (user) {
    return (
      <>
        <div className="container mx-auto max-w-7xl flex items-center justify-between p-4"></div>
        <Products prod={products} />{" "}
        {/* Pass the filtered products to the Products component */}
      </>
    );
  }

  return <div></div>;
};

const Home = () => {
  return <HomePage />;
};

export default Home;
