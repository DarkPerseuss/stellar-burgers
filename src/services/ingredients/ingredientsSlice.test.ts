import { describe, expect, test } from '@jest/globals';
import { ingredientsSlice, getIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';
describe('ingredientsSlice reducer', () => {
  test('Проверка на неизвестный тип', () => {
    const state = ingredientsSlice.reducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('Action pending', () => {
    const state = ingredientsSlice.reducer(
      {
        ingredients: [],
        isLoading: false,
        error: 'Ошибка'
      },
      getIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('Action rejected', () => {
    const error = new Error('Ошибка');

    const state = ingredientsSlice.reducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      getIngredients.rejected(error, '', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка'
    });
  });

  test('Action fulfilled', () => {
    const ingredient: TIngredient = {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const state = ingredientsSlice.reducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      getIngredients.fulfilled([ingredient], '', undefined)
    );

    expect(state).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null
    });
  });
});
