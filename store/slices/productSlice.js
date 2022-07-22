import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../utils/client";

const initialState = {
  isLoading: false,
  products: [],
  product: [],
  error: '',
  darkMode: null

}

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const products = await client.fetch(`*[_type == "product"]`);
    return products;
  } catch (error) {
    return rejectWithValue(error.message);
  }
})



export const getProductDetails = createAsyncThunk('product/getProductDetails', async (slug, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug });
    return product;
  } catch (error) {
    return rejectWithValue(error.message);
  }
})


export const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    // get products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = '';
      }),
      builder.addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [],
          state.error = action.payload;

      }),
      // get product details
      builder.addCase(getProductDetails.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(getProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
        state.error = '';
      }),
      builder.addCase(getProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.product = [],
          state.error = action.payload;

      })
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    }
  }
})

export const { setDarkMode } = productSlice.actions;
export default productSlice.reducer;    