// pages/index.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchData } from "../redux/store/dataSlice";
import NestedComponentA from "../components/ProductSideSheet";
import NestedComponentB from "../components/MyChatScreen";
import { AppDispatch } from "../redux/store/store";
import MyChatScreen from "../components/MyChatScreen";
import ProductCards from "./ProductCards";

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <div>
      <MyChatScreen />
      <ProductCards />
    </div>
  );
};

export default HomePage;
