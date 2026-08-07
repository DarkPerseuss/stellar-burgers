import { nanoid, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { createOrder } from '../order/orderSlice';

type BurgerConstructorStore = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: BurgerConstructorStore = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) => {
      state.ingredients.splice(
        action.payload.to,
        0,
        state.ingredients.splice(action.payload.from, 1)[0]
      );
    }
  },
  selectors: {
    bunSelector: (state) => state.bun,

    ingredientsBurgerSelector: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const { addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;

export const { bunSelector, ingredientsBurgerSelector } =
  burgerConstructorSlice.selectors;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
