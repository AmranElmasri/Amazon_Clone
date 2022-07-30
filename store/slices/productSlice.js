import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '../../utils/client';
import Cookies from 'js-cookie';

const initialState = {
  isLoading: false,
  products: [],
  product: [],
  error: '',
  darkMode: null,
  cartItems: Cookies.get('cartItems')
    ? JSON.parse(Cookies.get('cartItems'))
    : [],
  shippingAddress: Cookies.get('shippingAddress')
    ? JSON.parse(Cookies.get('shippingAddress'))
    : {},
  paymentMethod: Cookies.get('paymentMethod')
    ? Cookies.get('paymentMethod')
    : '',
  orderDetails: [],
  orders: []
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const products = await client.fetch(`*[_type == "product"]`);
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (slug, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug }
      );
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const productSlice = createSlice({
  name: 'product',
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
        state.products = [];
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
        state.product = [];
        state.error = action.payload;
      });
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    setAddToCart: (state, action) => {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item._key === newItem._key
      );
      const newCartItems = existItem
        ? state.cartItems.map((item) =>
            item._key === newItem._key ? newItem : item
          )
        : [...state.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(newCartItems));
      state.cartItems = newCartItems;
    },
    setRemoveCartItem: (state, action) => {
      const newCartItems = state.cartItems.filter(
        (item) => item.slug !== action.payload
      );
      Cookies.set('cartItems', JSON.stringify(newCartItems));
      state.cartItems = newCartItems;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      Cookies.set('shippingAddress', JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
    },
    setPaymentMethodAction: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setClearCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = '';
    },
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    setFetchOrders: (state, action) => {
      state.orders = action.payload;
    }
  },
});

export const {
  setDarkMode,
  setAddToCart,
  setRemoveCartItem,
  setShippingAddress,
  setLogout,
  setPaymentMethodAction,
  setClearCart,
  setOrderDetails,
  setFetchOrders
} = productSlice.actions;
export default productSlice.reducer;
