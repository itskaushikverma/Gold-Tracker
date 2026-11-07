import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { useToast } from 'react-toast-kit-js';
import { useGoogleAuthMutation } from '../../services/api';
import { setCredentials } from '../../redux/slices/sessionSlice';
import { cn } from '../../lib/utils';
import { MotionSpan } from '../common/MotionWrapper';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let googleScriptPromise = null;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Sign-In')));
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

export default function GoogleAuthButton() {
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();
  const [scriptReady, setScriptReady] = useState(false);

  const onCredential = useEffectEvent(async (response) => {
    if (!response?.credential) {
      toast.error('Google sign-in failed. Please try again.');
      return;
    }

    try {
      const resp = await googleAuth({ credential: response.credential }).unwrap();
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
      toast.error(err?.data?.message || err?.message || 'Google authentication failed');
    }
  });

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!GOOGLE_CLIENT_ID) {
        toast.error('Google Client ID is not configured');
        return;
      }

      try {
        await loadGoogleScript();
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => onCredential(response),
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: Math.max(buttonRef.current.offsetWidth || 320, 280),
          logo_alignment: 'center',
        });

        setScriptReady(true);
      } catch (err) {
        toast.error(err?.message || 'Failed to initialize Google Sign-In');
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-10 w-full">
      <div
        ref={buttonRef}
        className={cn(
          'flex w-full justify-center',
          isLoading && 'pointer-events-none opacity-40',
          !scriptReady && 'invisible',
        )}
      />

      {!scriptReady && (
        <div className="absolute inset-0 flex h-10 w-full cursor-wait items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 text-sm font-medium text-slate-300">
          <MotionSpan
            className="inline-flex"
            animate={{ rotate: 360 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <Loader2 className="h-4 w-4 text-blue-400" />
          </MotionSpan>
          Loading Google…
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex cursor-wait items-center justify-center rounded-full bg-slate-950/80 backdrop-blur-[1px]">
          <MotionSpan
            className="inline-flex"
            animate={{ rotate: 360 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <Loader2 className="h-5 w-5 text-blue-400" />
          </MotionSpan>
        </div>
      )}
    </div>
  );
}
