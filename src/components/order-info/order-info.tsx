import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredients/ingredientsSlice';
import { orderListSelector } from '../../services/orderListSlice/orderListSlice';
import { useParams } from 'react-router-dom';
import { feedOrdersSelector } from '../../services/feed/feedSlice';
export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const feedOrders = useSelector(feedOrdersSelector);
  const profileOrders = useSelector(orderListSelector);
  const { number } = useParams<{ number: string }>();

  const orderData =
    profileOrders.find((order) => order.number === Number(number)) ||
    feedOrders.find((order) => order.number === Number(number));

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
