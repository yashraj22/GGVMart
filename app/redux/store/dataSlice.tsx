import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface FetchDataArgs {
  userId: string;
}
export const fetchData = createAsyncThunk<
  any, // Return type of the payload creator
  FetchDataArgs, // Argument type for the payload creator
  { rejectValue: string } // Type of the reject value
>("data/fetchData", async (arg, thunkAPI) => {
  const { userId } = arg;
  const response = await fetch(`/api/product/myproduct/${userId}`);
  const data = await response.json();
  return data.products;
});

const dataSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
