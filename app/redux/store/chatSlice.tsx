import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface FetchDataArgs {
  productId: string;
}
export const fetchChatData = createAsyncThunk<
  any,
  FetchDataArgs,
  { rejectValue: string }
>("data/fetchChatData", async (arg, thunkAPI) => {
  const { productId } = arg;
  const response = await fetch(`/api/chats/${productId}`);
  const data = await response.json();
  return data.chats;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default chatSlice.reducer;
