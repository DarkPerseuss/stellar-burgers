import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type OrderStore = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderStore = {
  order: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return {
      _id: data.order._id,
      status: data.order.status,
      name: data.order.name,
      createdAt: data.order.createdAt,
      updatedAt: data.order.updatedAt,
      number: data.order.number,
      ingredients
    };
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,

  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },

  selectors: {
    orderSelector: (state) => state.order,
    orderLoadingSelector: (state) => state.isLoading,
    orderErrorSelector: (state) => state.error
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const { orderSelector, orderLoadingSelector, orderErrorSelector } =
  orderSlice.selectors;

export const orderReducer = orderSlice.reducer;
