import { ReactElement } from 'react';
import {
  userSelector,
  authCheckedSelector
} from '../../services/user/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(authCheckedSelector);
  const user = useSelector(userSelector);
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (!user && !onlyUnAuth) {
    return <Navigate state={{ from: location }} replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate replace to={from} />;
  }

  return children;
};
