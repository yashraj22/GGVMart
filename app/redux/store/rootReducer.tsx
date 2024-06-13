import { combineReducers } from "redux";
import productReducer from "./dataSlice";
import chatReducer from "./chatSlice";

const dataReducer = combineReducers({
  chat: chatReducer,
  product: productReducer,
});

const rootReducer = combineReducers({
  data: dataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
