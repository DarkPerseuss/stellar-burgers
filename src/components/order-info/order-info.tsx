import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector, useDispatch } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredients/ingredientsSlice';
import { orderListSelector } from '../../services/orderListSlice/orderListSlice';
import { useParams } from 'react-router-dom';
import { feedOrdersSelector } from '../../services/feed/feedSlice';
import styles from '../ui/order-info/order-info.module.css';
import { orderSelector } from '../../services/order/orderSlice';
import { getOrderByNumber } from '../../services/order/orderSlice';
export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const feedOrders = useSelector(feedOrdersSelector);
  const profileOrders = useSelector(orderListSelector);
  const { number } = useParams<{ number: string }>();
  const orderId = useSelector(orderSelector);
  const orderData =
    profileOrders.find((order) => order.number === Number(number)) ||
    feedOrders.find((order) => order.number === Number(number)) ||
    (orderId?.number === Number(number) ? orderId : null);

  useEffect(() => {
    if (!number || orderData) {
      return;
    }

    dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number, orderData]);

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

  return (
    <>
      <p className={`text text_type_digits-default ${styles.number}`}>
        #{number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
