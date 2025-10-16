import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params = {}, { getState }) => {
    const { offset = 0, limit = 6 } = params;
    const token = getState().auth.token;

    const res = await api.get(`/products?offset=${offset}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    //  products return into an array  
    return res.data.products || res.data || [];
  }
);


//  productSlice
const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;