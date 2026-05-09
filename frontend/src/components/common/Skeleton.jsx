import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-slate-800/50', className)} {...props} />;
};

export const DashboardSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-100 rounded-2xl" />
    </div>
  );
};

export const PerformanceSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-125 rounded-2xl" />
    </div>
  );
};
