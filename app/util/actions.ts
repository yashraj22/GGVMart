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
