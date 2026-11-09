import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { useToast } from 'react-toast-kit-js';
import { useAuthBypassMutation } from '../../services/api';
import { setCredentials } from '../../redux/slices/sessionSlice';
import { MotionSpan } from '../common/MotionWrapper';

export default function BypassAuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const started = useRef(false);
  const [authBypass, { isLoading }] = useAuthBypassMutation();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      try {
        const resp = await authBypass().unwrap();
        if (resp?.success) {
          dispatch(
            setCredentials({
              isAuthenticated: true,
              userEmail: resp?.data?.user_email || null,
              userName: resp?.data?.user_name || null,
              userAvatar: resp?.data?.user_avatar || null,
            }),
          );
          navigate('/home');
        }
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Auth bypass failed');
      }
    };

    run();
  }, [authBypass, dispatch, navigate, toast]);

  return (
    <div className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 text-sm font-medium text-slate-300">
      <MotionSpan
        className="inline-flex"
        animate={{ rotate: 360 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <Loader2 className="h-4 w-4 text-blue-400" />
      </MotionSpan>
      {isLoading ? 'Signing in…' : 'Dev bypass…'}
    </div>
  );
}
