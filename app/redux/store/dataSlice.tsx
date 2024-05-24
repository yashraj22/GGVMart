import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk("data/fetchData", async () => {
  //TODO: CHANGE API ENDPOINTS
  const response = await fetch("/api/data/");
  const data = await response.json();
  return data;
});

const dataSlice = createSlice({
  name: "data",
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
