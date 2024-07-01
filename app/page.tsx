"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "./context/AuthContext";
import Products from "./components/Products";
import { useSearch } from "./context/SearchContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store/store";
import { fetchData } from "./redux/store/dataSlice";
import supabase from "./util/supabaseClient";

const HomePage = () => {
  const { user }: any = useUserAuth();

  const { products, setProducts } = useSearch();

  const [chats, setChats] = useState([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
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

    if (user) {
      const getIdFetch = async () => {
        const { data } = await supabase.auth.getSession();
        const id: any = data.session?.user.id;
        if (id) {
          dispatch(fetchData({ userId: id }));
        }
      };
      getIdFetch();
    }

    fetchProducts();
  }, [user, dispatch]);

  return (
    <>
      <div className="container mx-auto max-w-7xl flex items-center justify-between p-4"></div>
      <Products prod={products} />{" "}
    </>
  );

  return <div></div>;
};

const Home = () => {
  return (
    <>
      <HomePage />
    </>
  );
};

export default Home;
