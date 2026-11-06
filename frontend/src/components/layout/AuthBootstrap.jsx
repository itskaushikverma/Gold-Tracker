import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../../services/api';
import { setCredentials } from '../../redux/slices/sessionSlice';

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);
  const { data, isSuccess, isError, isFetching } = useGetMeQuery(undefined, {
    skip: isAuthenticated !== null,
  });

  useEffect(() => {
    if (isAuthenticated !== null || isFetching) return;

    if (isSuccess && data?.data) {
      dispatch(
        setCredentials({
          isAuthenticated: true,
          userEmail: data.data.user_email || null,
          userName: data.data.user_name || null,
          userAvatar: data.data.user_avatar || null,
        }),
      );
      return;
    }

    if (isError) {
      dispatch(
        setCredentials({
          isAuthenticated: false,
          userEmail: null,
          userName: null,
          userAvatar: null,
        }),
      );
    }
  }, [data, dispatch, isAuthenticated, isError, isFetching, isSuccess]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return children;
}
