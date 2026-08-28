import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type OrderListStore = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderListStore = {
  orders: [],
  isLoading: false,
  error: null
};

export const getOrderList = createAsyncThunk(
  'orderList/getOrders',
  getOrdersApi
);

export const orderListSlice = createSlice({
  name: 'orderListSlice',
  initialState,
  reducers: {},
  selectors: {
    orderListSelector: (state) => state.orders,
    orderListLoadingSelector: (state) => state.isLoading,
    orderListErrorSelector: (state) => state.error
  },

  extraReducers: (builder) => {
    builder
      .addCase(getOrderList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});

export const {
  orderListSelector,
  orderListLoadingSelector,
  orderListErrorSelector
} = orderListSlice.selectors;

export const profileOrdersReducer = orderListSlice.reducer;
