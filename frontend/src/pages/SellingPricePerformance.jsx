import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Header from '../components/layout/Header';
import { MotionDiv } from '@/components/common/MotionWrapper';
import MySellingPriceChart from '@/components/dashboard/MySellingPriceChart';
import SmartSellingPriceChart from '@/components/dashboard/SmartSellingPriceChart';
import { useGetSellingPricePerformanceQuery } from '@/services/api';
import { useToast } from 'react-toast-kit-js';

const TABS = [
  {
    key: 'my',
    label: 'My Prices',
    color: '#3987e5',
  },
  {
    key: 'smart',
    label: 'Smart Chart',
    color: '#d95926',
  },
  {
    key: 'global',
    label: 'Global Prices',
    color: '#10b981',
  },
];

export default function SellingPricePerformance() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('my');

  const { currentData, isLoading, isFetching, isError, error } = useGetSellingPricePerformanceQuery(
    { scope: activeTab },
  );

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError, error]);

  const isBusy = isLoading || isFetching;
  const chartData = isError ? undefined : currentData;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full min-h-0 flex-col gap-6 overflow-hidden"
    >
      <Header
        title="Sell Price History"
        description="Track the custom sell prices you’ve set over time."
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAiBusy={isBusy}
      />

      <div className="min-h-100 flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md md:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'my' && (
            <MotionDiv
              key="tab-my"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <MySellingPriceChart
                data={chartData}
                isLoading={isBusy}
                errorMessage={error?.data?.message}
              />
            </MotionDiv>
          )}
          {activeTab === 'smart' && (
            <MotionDiv
              key="tab-smart"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <SmartSellingPriceChart
                data={chartData}
                isLoading={isBusy}
                errorMessage={error?.data?.message}
              />
            </MotionDiv>
          )}
          {activeTab === 'global' && (
            <MotionDiv
              key="tab-global"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <MySellingPriceChart
                data={chartData}
                isLoading={isBusy}
                name="Global Prices"
                color="#10b981"
                id="colorGlobalPrices"
                errorMessage={error?.data?.message}
              />
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </MotionDiv>
  );
}
