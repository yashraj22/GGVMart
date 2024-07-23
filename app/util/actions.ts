import { PURGE } from "redux-persist";
import { persistor } from "../redux/store/store";

export const purgeStore = () => {
  persistor.purge(); // optional: clear storage if needed
  persistor.flush(); // optional: flush storage to make sure state is persisted immediately
  return {
    type: PURGE,
    key: "root", // This should match the key you used in persistConfig
    result: () => null,
  };
};

export const fetchUserDetail = async (userId) => {
  try {
    const response = await fetch("/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch product details:", error);

    return null;
  }
};
