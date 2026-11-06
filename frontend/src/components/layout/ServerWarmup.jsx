import { useEffect } from 'react';
import Logo from '../common/Logo';
import LoaderAnimation from '../common/LoaderAnimation';
import { useHealthQuery } from '../../services/api';

const RETRY_MS = 3000;
const message = 'Waking up the server...';

export default function ServerWarmup({ children }) {
  const { isSuccess: ready, isError, isFetching, refetch } = useHealthQuery();

  useEffect(() => {
    if (ready || !isError || isFetching) return undefined;

    const retryId = window.setTimeout(() => {
      refetch();
    }, RETRY_MS);

    return () => window.clearTimeout(retryId);
  }, [isError, isFetching, ready, refetch]);

  if (ready) {
    return <div className="flex h-full min-h-0 flex-col">{children}</div>;
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <Logo withWordmark size={44} className="mb-6 justify-center" />
        <LoaderAnimation />
        <h2 className="text-foreground mt-2 text-lg font-medium">{message}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          This can take a moment on the first request.
        </p>
      </div>
    </div>
  );
}
