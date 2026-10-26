import { useEffect } from 'react';
import logo from '../assets/gold.svg';
import { useHealthQuery } from '../services/api';

const RETRY_MS = 3000;
const message = 'Waking up the server...';

export default function ServerWarmup({ children }) {
  const { isSuccess: ready, isError, isFetching, refetch } = useHealthQuery();

  useEffect(() => {
    if (!isError || isFetching || ready) return undefined;

    const retryId = window.setTimeout(() => {
      refetch();
    }, RETRY_MS);

    return () => window.clearTimeout(retryId);
  }, [isError, isFetching, ready, refetch]);

  if (ready) {
    return children;
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="Gold Tracker" className="mb-6 h-11 w-11 object-contain" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <h2 className="text-foreground mt-4 text-lg font-medium">{message}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          This can take a moment on the first request.
        </p>
      </div>
    </div>
  );
}
