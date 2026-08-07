import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderList,
  orderListSelector
} from '../../services/orderListSlice/orderListSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(orderListSelector);

  useEffect(() => {
    dispatch(getOrderList());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
