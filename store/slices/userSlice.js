import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      state.userInfo = action.payload;
      Cookies.set('userInfo', JSON.stringify(action.payload));
    },
    setUserLogout: (state, action) => {
      state.userInfo = null;
      Cookies.remove('userInfo');
      Cookies.remove('cartItems');
    },
  },
});

export const { setUserLogin, setUserLogout } = userSlice.actions;
export default userSlice.reducer;
