import { AnimatePresence } from 'motion/react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChartCandlestick,
  ChartLine,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Logo from '../common/Logo';
import { MotionButton, MotionDiv, MotionLabel } from '../common/MotionWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setSellPriceOverride } from '../../redux/slices/sessionSlice';
import { api, useLogoutMutation } from '../../services/api';
import { Switch } from '../ui/Switch';

const SIDEBAR_WIDTH = 'w-100';

const NAV_ITEMS = [
  {
    to: '/home',
    label: 'Home',
    icon: LayoutDashboard,
    activeBg: 'bg-blue-500/10 text-blue-50',
    activeBar: 'bg-blue-500',
    activeIcon: 'text-blue-400',
  },
  {
    to: '/my-growth',
    label: 'My Growth',
    icon: TrendingUp,
    activeBg: 'bg-cyan-500/10 text-cyan-50',
    activeBar: 'bg-cyan-500',
    activeIcon: 'text-cyan-400',
  },
  {
    to: '/sell-price-history',
    label: 'Sell Price History',
    icon: ChartCandlestick,
    activeBg: 'bg-amber-500/10 text-amber-50',
    activeBar: 'bg-amber-500',
    activeIcon: 'text-amber-400',
  },
  {
    to: '/purchase-price-history',
    label: 'Purchase Price History',
    icon: ChartLine,
    activeBg: 'bg-green-500/10 text-green-50',
    activeBar: 'bg-green-500',
    activeIcon: 'text-green-400',
  },
];

function SidebarNavItem({ to, label, icon: Icon, activeBg, activeBar, activeIcon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 font-medium transition-colors duration-200',
          isActive
            ? cn(activeBg, 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.05)]')
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div
              className={cn(
                'absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full',
                activeBar,
              )}
            />
          )}
          <Icon
            className={cn(
              'h-5 w-5 shrink-0',
              isActive ? activeIcon : 'text-slate-500 transition-colors group-hover:text-slate-300',
            )}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ isOpen, onClose, isDesktopOpen = true, onToggleDesktop }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const { sellPriceOverride, userEmail, userName, userAvatar } = useSelector(
    (state) => state.session,
  );

  const onSellPriceOverrideChange = (checked) => {
    dispatch(setSellPriceOverride(checked));
  };

  const onLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // clear local session even if logout request fails
    }
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate('/auth');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            key="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static lg:h-screen',
          SIDEBAR_WIDTH,
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isDesktopOpen
            ? 'lg:translate-x-0'
            : 'lg:w-0 lg:-translate-x-full lg:border-r-0 lg:opacity-0',
        )}
      >
        <div className="flex w-full shrink-0 items-center justify-between border-b border-slate-800/50 p-6">
          <div className="flex min-w-0 items-center gap-3">
            <Logo size={40} className="shrink-0" />
            <div className="min-w-0 overflow-hidden whitespace-nowrap">
              <h1 className="text-lg leading-tight font-bold tracking-tight text-slate-100">
                Gold Tracker
              </h1>
              <p className="text-xs font-medium text-slate-400">Investment Portfolio</p>
            </div>
          </div>

          <MotionButton
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </MotionButton>

          <MotionButton
            onClick={onToggleDesktop}
            className="-mr-2 hidden shrink-0 cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white lg:flex"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </MotionButton>
        </div>

        <nav className="relative flex w-full flex-1 flex-col space-y-2 overflow-y-auto p-4">
          <div className="mb-4 pl-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Menu
          </div>

          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.to} {...item} onNavigate={onClose} />
          ))}

          <MotionLabel
            htmlFor="sell-price-override"
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-colors duration-200 hover:bg-slate-800/50 hover:text-slate-200"
          >
            <span className="truncate">Use Custom Sell Price</span>
            <Switch
              id="sell-price-override"
              checked={sellPriceOverride}
              onCheckedChange={onSellPriceOverrideChange}
            />
          </MotionLabel>
        </nav>

        <div className="w-full shrink-0 space-y-3 border-t border-slate-800/50 p-4">
          <div className="flex items-center gap-3 px-1">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt=""
                referrerPolicy="no-referrer"
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-700"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300 ring-1 ring-slate-700">
                {(userName || userEmail || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              {userName ? (
                <p className="truncate text-sm font-medium text-slate-100">{userName}</p>
              ) : null}
              {userEmail ? <p className="truncate text-xs text-slate-400">{userEmail}</p> : null}
            </div>
          </div>

          <MotionButton
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 font-medium text-red-400 ring-1 ring-red-500/30 transition-colors duration-200 hover:bg-red-500/20 hover:text-red-300 hover:ring-red-500/50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </MotionButton>

          <p className="px-1 text-center text-xs leading-relaxed text-slate-500">
            <Link
              to="/terms"
              onClick={onClose}
              className="cursor-pointer text-slate-400 underline underline-offset-4 hover:text-slate-200"
            >
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              onClick={onClose}
              className="cursor-pointer text-slate-400 underline underline-offset-4 hover:text-slate-200"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </aside>
    </>
  );
}
