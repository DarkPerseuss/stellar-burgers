import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { burgerConstructorSlice } from './burger-constructor/burgerConstructorSlice';
import { userSlice } from './user/userSlice';
import { orderSlice } from './order/orderSlice';
import { feedSlice } from './feed/feedSlice';
import { orderListSlice } from './orderListSlice/orderListSlice';
export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  userSlice,
  orderSlice,
  feedSlice,
  orderListSlice
);
