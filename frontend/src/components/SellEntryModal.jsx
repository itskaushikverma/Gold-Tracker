import { AnimatePresence } from 'motion/react';
import { X, CheckSquare, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { cn } from '../lib/utils';
import { MotionButton, MotionDiv } from './common/MotionWrapper';
import { formatCurrency } from '../utils/formatCurrency';
import { useSellMutation } from '../services/api';
import { useSelector } from 'react-redux';
import { useToast } from './common/Toast';

export default function SellEntryModal({ isOpen, onClose, selectedItems }) {
  const toast = useToast();
  const [sell, { isLoading }] = useSellMutation();
  const user_id = useSelector((state) => state.auth.user_id);

  const totalWeight = selectedItems?.reduce((sum, item) => sum + item?.weight || 0, 0);
  const totalInvested = selectedItems?.reduce((sum, item) => sum + item?.investedValue || 0, 0);
  const totalCurrentValue = selectedItems?.reduce((sum, item) => sum + item?.currentValue || 0, 0);
  const profitLoss = totalCurrentValue - totalInvested;
  const isProfitable = profitLoss >= 0;

  const onSubmit = async () => {
    try {
      const payload = {
        investment_ids: selectedItems?.map((item) => item?._id),
        user_id,
      };
      const resp = await sell(payload).unwrap();
      if (resp?.success) {
        onClose();
        toast.success(resp?.message);
      }
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm lg:p-0"
          >
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-rose-500 to-orange-400" />
              <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />

              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  Confirm Sale
                </h2>
                <MotionButton
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  onClick={onClose}
                  className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </MotionButton>
              </div>

              <div className="relative z-10">
                <p className="mb-6 text-sm text-slate-300">
                  You are about to sell {selectedItems.length} selected investment
                  {selectedItems.length > 1 ? 's' : ''}. Here is the summary:
                </p>

                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
                    <div className="flex items-center gap-3">
                      <Scale className="h-5 w-5 text-amber-500/70" />
                      <span className="font-medium text-slate-300">Total Weight</span>
                    </div>
                    <span className="font-mono font-semibold text-amber-400">{totalWeight}mg</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">Total Invested</span>
                      <span className="font-mono font-medium text-slate-200">{formatCurrency(totalInvested)}</span>
                    </div>
                    <div className="text-slate-600">→</div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-400">Sell Value</span>
                      <span className="font-mono text-lg font-bold text-slate-100">{formatCurrency(totalCurrentValue)}</span>
                    </div>
                  </div>

                  <div className={cn('flex items-center justify-between rounded-xl border p-4', isProfitable ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-rose-500/20 bg-rose-500/10')}>
                    <div className="flex items-center gap-3">
                      {isProfitable ? <TrendingUp className="h-5 w-5 text-emerald-500" /> : <TrendingDown className="h-5 w-5 text-rose-500" />}
                      <span className={cn('font-medium', isProfitable ? 'text-emerald-400' : 'text-rose-400')}>{isProfitable ? 'Net Profit' : 'Net Loss'}</span>
                    </div>
                    <span className={cn('font-mono text-lg font-bold', isProfitable ? 'text-emerald-400' : 'text-rose-400')}>
                      {isProfitable ? '+' : ''}
                      {formatCurrency(profitLoss)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MotionButton
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 cursor-pointer rounded-xl border border-transparent bg-slate-800/50 px-4 py-2.5 font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    Cancel
                  </MotionButton>
                  <MotionButton
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    type="submit"
                    disabled={isLoading}
                    onClick={onSubmit}
                    className="flex-1 cursor-pointer rounded-xl bg-linear-to-r from-rose-600 to-orange-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-rose-500/20 transition-colors hover:from-rose-500 hover:to-orange-400"
                  >
                    {isLoading ? 'Selling...' : 'Confirm Sell'}
                  </MotionButton>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
}
