import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PanelLeftOpen, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { MotionButton, MotionDiv } from '../common/MotionWrapper';
import AddEntryModal from '../modals/AddEntryModal';
import Badge from '../common/Badge';
import { cn } from '../../lib/utils';

export default function Header({
  details,
  dashboardType,
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  isAiBusy = false,
}) {
  const { sidebarClosed, onOpenSidebar } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const badges = [
    {
      title: 'Total Weight',
      value: `${details?.totalPurchasedGoldWeight || 0} mg`,
      valueClassName: 'text-amber-400',
    },
    {
      title: 'Price with GST',
      value: `${formatCurrency(details?.currentGoldPriceWithGST || 0)}/mg`,
      valueClassName: 'text-emerald-400',
    },
    {
      title: 'Price without GST',
      value: `${formatCurrency(details?.currentGoldPriceWithoutGST || 0)}/mg`,
      valueClassName: 'text-blue-400',
    },
    {
      title: 'Selling Price',
      value: `${formatCurrency(details?.currentGoldSellingPrice || 0)}/mg`,
      valueClassName: 'text-emerald-400',
    },
    {
      title: 'Custom Selling Price',
      value: `${formatCurrency(details?.overrideSellingPrice || 0)}/mg`,
      valueClassName: 'text-violet-400',
    },
  ];

  return (
    <>
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="h-full w-full space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h1>
            <p className="text-sm text-slate-400 md:text-base">{description}</p>
          </div>

          {dashboardType === 'overview' && (
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <Badge
                  key={badge.title}
                  title={badge.title}
                  value={badge.value}
                  valueClassName={badge.valueClassName}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {dashboardType === 'overview' && (
            <MotionButton
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-medium text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-colors duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] md:w-fit"
            >
              <Plus className="h-5 w-5" />
              Add Gold
            </MotionButton>
          )}

          {tabs?.length > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/60 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange?.(tab.key)}
                  className="relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                >
                  {activeTab === tab.key && (
                    <MotionDiv
                      layoutId="selling-price-tab-indicator"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: `${tab.color}26`,
                        boxShadow: `inset 0 0 0 1px ${tab.color}66`,
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-10 flex items-center gap-1.5',
                      activeTab === tab.key ? 'text-white' : 'text-slate-400',
                    )}
                  >
                    {tab.label}
                    {tab.key === 'smart' && isAiBusy && (
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}

          {sidebarClosed && (
            <MotionButton
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={onOpenSidebar}
              className="hidden cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-400 shadow-lg backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white lg:inline-flex"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </MotionButton>
          )}
        </div>
      </header>

      <AddEntryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
