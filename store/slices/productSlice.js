import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../utils/client";

const initialState = {
    isLoading: false,
    products: [],
    error: '',
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

export const productSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
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

            })
    }
})

// export const { } = productSlice.actions;
export default productSlice.reducer;    