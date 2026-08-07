import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeed, feedOrdersSelector } from '../../services/feed/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(feedOrdersSelector);

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  };
  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
