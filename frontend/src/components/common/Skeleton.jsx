import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-slate-800/50', className)} {...props} />;
};

export const HeaderSkeleton = () => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-30 rounded-2xl" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <HeaderSkeleton />

      <div className="flex min-h-0 flex-1 flex-col gap-8">
        <div className="grid shrink-0 grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="min-h-0 flex-1 rounded-2xl" />
      </div>
    </div>
  );
};

export const PerformanceSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <HeaderSkeleton />
      <Skeleton className="min-h-0 flex-1 rounded-2xl" />
    </div>
  );
};
