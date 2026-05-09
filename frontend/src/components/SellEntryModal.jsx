import { AnimatePresence } from 'motion/react';
import { X, CheckSquare, Scale, Calendar, Wallet } from 'lucide-react';
import { MotionButton, MotionDiv } from './common/MotionWrapper';
import { useSellMutation } from '../services/api';
import { useSelector } from 'react-redux';
import { useToast } from './common/Toast';
import { useForm } from 'react-hook-form';
import CustomInput from './common/CustomInput';

export default function SellEntryModal({ isOpen, onClose, totalWeight }) {
  const toast = useToast();
  const [sell, { isLoading }] = useSellMutation();
  const user_id = useSelector((state) => state.auth.user_id);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: '',
      price: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        user_id,
        weight: parseFloat(data.weight),
        date: data.date,
        price: parseFloat(data.price),
      };
      const resp = await sell(payload).unwrap();
      if (resp?.success) {
        onClose();
        reset();
        toast.success(resp?.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Selling failed');
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

              <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-4">
                <p className="mb-2 text-sm text-slate-300">
                  You are selling from your gold portfolio.
                </p>

                <div className="mb-6 space-y-4">
                  <CustomInput
                    register={register}
                    type="date"
                    rules={{ required: 'Sale date is required' }}
                    label="Sale Date"
                    icon={Calendar}
                    name={'date'}
                    errors={errors}
                    disabled={isLoading || isSubmitting}
                  />

                  <CustomInput
                    register={register}
                    type="number"
                    rules={{ 
                      required: 'Weight is required', 
                      min: { value: 0.01, message: 'Weight should be greater than 0' },
                      max: { value: totalWeight, message: `Cannot sell more than available (${totalWeight}mg)` },
                      valueAsNumber: true 
                    }}
                    label="Weight to Sell (mg)"
                    placeholder={`Available: ${totalWeight}mg`}
                    icon={Scale}
                    name={'weight'}
                    errors={errors}
                    disabled={isLoading || isSubmitting}
                  />

                  <CustomInput
                    register={register}
                    type="number"
                    rules={{ 
                      required: 'Sale Price is required', 
                      min: { value: 1, message: 'Price should be greater than 0' },
                      valueAsNumber: true 
                    }}
                    label="Total Sale Price (Rs)"
                    placeholder="e.g. 5500"
                    icon={Wallet}
                    name={'price'}
                    errors={errors}
                    disabled={isLoading || isSubmitting}
                  />

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
                    disabled={isLoading || isSubmitting || !isValid}
                    className="flex-1 cursor-pointer rounded-xl bg-linear-to-r from-rose-600 to-orange-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-rose-500/20 transition-colors hover:from-rose-500 hover:to-orange-400 disabled:opacity-50"
                  >
                    {isLoading || isSubmitting ? 'Processing...' : 'Confirm Sale'}
                  </MotionButton>
                </div>
              </form>
            </MotionDiv>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
}

