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
  },
});

export const { setUserLogin } = userSlice.actions;
export default userSlice.reducer;