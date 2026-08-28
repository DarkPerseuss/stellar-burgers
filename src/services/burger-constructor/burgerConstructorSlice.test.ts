import { describe, expect, test } from '@jest/globals';
import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient
} from './burgerConstructorSlice';

import { TIngredient, TConstructorIngredient } from '@utils-types';
import { createOrder } from '../order/orderSlice';

describe('burgerConstructorSlice reducer', () => {
  test('Проверка на неизвестный тип', () => {
    const state = burgerConstructorSlice.reducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Добавление булки', () => {
    const bun: TIngredient = {
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

    const state = burgerConstructorSlice.reducer(
      {
        bun: null,
        ingredients: []
      },
      addIngredient(bun)
    );

    expect(state.bun).toEqual({
      ...bun,
      id: expect.any(String)
    });

    expect(state.ingredients).toEqual([]);
  });

  test('Добавление начинки', () => {
    const ingredient: TIngredient = {
      _id: '2',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const state = burgerConstructorSlice.reducer(
      {
        bun: null,
        ingredients: []
      },
      addIngredient(ingredient)
    );

    expect(state.bun).toBeNull();

    expect(state.ingredients).toHaveLength(1);

    expect(state.ingredients[0]).toEqual({
      ...ingredient,
      id: expect.any(String)
    });
  });

  test('Удаление ингредиента', () => {
    const ingredient: TConstructorIngredient = {
      _id: '2',
      id: 'nanoidId',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const state = burgerConstructorSlice.reducer(
      {
        bun: null,
        ingredients: [ingredient]
      },
      removeIngredient('nanoidId')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('Перемещение ингредиента', () => {
    const firstIngredient: TConstructorIngredient = {
      _id: '1',
      id: 'first',
      name: 'первый ингредиент',
      type: 'main',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 1,
      price: 1,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const secondIngredient: TConstructorIngredient = {
      _id: '2',
      id: 'second',
      name: 'второй ингредиент',
      type: 'main',
      proteins: 2,
      fat: 2,
      carbohydrates: 2,
      calories: 2,
      price: 2,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const state = burgerConstructorSlice.reducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredient({
        from: 0,
        to: 1
      })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  test('Очистка конструктора после успешного заказа', () => {
    const bun: TIngredient = {
      _id: '1',
      name: 'Краторная булка',
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

    const ingredient: TConstructorIngredient = {
      _id: '2',
      id: 'nanoidId',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const state = burgerConstructorSlice.reducer(
      {
        bun,
        ingredients: [ingredient]
      },
      {
        type: createOrder.fulfilled.type
      }
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
