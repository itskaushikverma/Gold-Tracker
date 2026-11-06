import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RiRefreshLine } from '@remixicon/react';
import { useToast } from 'react-toast-kit-js';
import { useGoogleAuthMutation } from '../../services/api';
import { setCredentials } from '../../redux/slices/sessionSlice';

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
        navigate('/dashboard');
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
    <div className="relative w-full">
      <div
        ref={buttonRef}
        className={`flex w-full justify-center ${isLoading ? 'pointer-events-none opacity-40' : ''}`}
      />

      {!scriptReady && (
        <div className="absolute inset-0 flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-black">
          <RiRefreshLine className="h-4 w-4 animate-spin" />
          Loading Google…
        </div>
      )}

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-[#131314]/70">
          <RiRefreshLine className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
