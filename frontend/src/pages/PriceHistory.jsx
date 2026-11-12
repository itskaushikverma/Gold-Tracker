import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Header from '../components/layout/Header';
import { MotionDiv } from '@/components/common/MotionWrapper';
import MyPriceChart from '@/components/dashboard/MyPriceChart';
import SmartPriceChart from '@/components/dashboard/SmartPriceChart';
import { useGetCustomPriceQuery } from '@/services/api';
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

const TYPE_CONFIG = {
  sell: {
    label: 'Sell',
    myName: 'My Sell Prices',
    smartName: 'Smart Sell Chart',
    globalName: 'Global Sell Prices',
    myColor: '#34d399',
    myId: 'colorMySellPrices',
  },
  purchase: {
    label: 'Purchase',
    myName: 'My Purchase Prices',
    smartName: 'Smart Purchase Chart',
    globalName: 'Global Purchase Prices',
    myColor: '#60a5fa',
    myId: 'colorMyPurchasePrices',
  },
};

export default function PriceHistory({ type }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('my');
  const typeConfig = TYPE_CONFIG[type];

  const { currentData, isLoading, isFetching, isError, error } = useGetCustomPriceQuery({
    scope: activeTab,
    type,
  });

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError, error]);

  const isBusy = isLoading || isFetching;
  const chartData = isError ? undefined : currentData;
  const errorMessage = isError ? error?.data?.message : undefined;

  return (
    <MotionDiv
      key={type}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full min-h-0 flex-col gap-6 overflow-hidden"
    >
      <Header
        title={`${typeConfig.label} Price History`}
        description={`Track the custom ${type} prices you’ve set over time.`}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAiBusy={isBusy}
      />

      <div className="min-h-100 flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md md:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'my' && (
            <MotionDiv
              key={`tab-my-${type}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <MyPriceChart
                data={chartData}
                isLoading={isBusy}
                isError={isError}
                name={typeConfig.myName}
                color={typeConfig.myColor}
                id={typeConfig.myId}
                errorMessage={errorMessage}
              />
            </MotionDiv>
          )}
          {activeTab === 'smart' && (
            <MotionDiv
              key={`tab-smart-${type}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <SmartPriceChart
                data={chartData}
                isLoading={isBusy}
                isError={isError}
                name={typeConfig.smartName}
                errorMessage={errorMessage}
              />
            </MotionDiv>
          )}
          {activeTab === 'global' && (
            <MotionDiv
              key={`tab-global-${type}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <MyPriceChart
                data={chartData}
                isLoading={isBusy}
                isError={isError}
                name={typeConfig.globalName}
                color="#10b981"
                id={`colorGlobalPrices-${type}`}
                errorMessage={errorMessage}
              />
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </MotionDiv>
  );
}
