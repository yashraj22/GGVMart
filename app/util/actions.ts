import { PURGE } from "redux-persist";

export const purgeStore = () => {
  return {
    type: PURGE,
    key: "root", // This should match the key you used in persistConfig
    result: () => null,
  };
};
