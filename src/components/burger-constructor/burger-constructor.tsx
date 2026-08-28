import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';

import {
  bunSelector,
  ingredientsBurgerSelector
} from '../../services/burger-constructor/burgerConstructorSlice';

import {
  createOrder,
  orderSelector,
  orderLoadingSelector,
  clearOrder
} from '../../services/order/orderSlice';

import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../services/user/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const bun = useSelector(bunSelector);
  const ingredients = useSelector(ingredientsBurgerSelector);
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const constructorItems = {
    bun,
    ingredients
  };

  const orderRequest = useSelector(orderLoadingSelector);

  const orderModalData = useSelector(orderSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientsIdArray = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientsIdArray));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems.bun, constructorItems.ingredients]
  );

  //return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
