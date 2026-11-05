import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiCloseLine,
  RiDashboardLine,
  RiLineChartLine,
  RiLogoutBoxRLine,
  RiSidebarFoldLine,
} from '@remixicon/react';
import { cn } from '../../lib/utils';
import logo from '../../assets/gold.svg';
import { MotionButton, MotionLabel } from '../common/MotionWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setSellPriceOverride } from '../../redux/slices/sessionSlice';
import { api, useLogoutMutation } from '../../services/api';
import { Switch } from '../ui/switch';

const SIDEBAR_WIDTH = 'w-100';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: RiDashboardLine,
    activeBg: 'bg-blue-500/10 text-blue-50',
    activeBar: 'bg-blue-500',
    activeIcon: 'text-blue-400',
  },
  {
    to: '/performance',
    label: 'Performance',
    icon: RiLineChartLine,
    activeBg: 'bg-cyan-500/10 text-cyan-50',
    activeBar: 'bg-cyan-500',
    activeIcon: 'text-cyan-400',
  },
  {
    to: '/selling-price-performance',
    label: 'Selling Price Performance',
    icon: RiLineChartLine,
    activeBg: 'bg-cyan-500/10 text-cyan-50',
    activeBar: 'bg-cyan-500',
    activeIcon: 'text-cyan-400',
  },
];

function SidebarNavItem({ to, label, icon: Icon, activeBg, activeBar, activeIcon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 font-medium transition-colors duration-200',
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
  const sellPriceOverride = useSelector((state) => state.session.sellPriceOverride);

  const onSellPriceOverrideChange = (checked) => {
    dispatch(setSellPriceOverride(checked));
    dispatch(api.util.prefetch('getDetails', { sellPriceOverride: checked }, { force: true }));
    dispatch(api.util.prefetch('getPerformance', { sellPriceOverride: checked }, { force: true }));
  };

  const onLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // clear local session even if logout request fails
    }
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static',
          SIDEBAR_WIDTH,
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isDesktopOpen
            ? 'lg:translate-x-0'
            : 'lg:w-0 lg:-translate-x-full lg:border-r-0 lg:opacity-0',
        )}
      >
        <div className="flex w-full shrink-0 items-center justify-between border-b border-slate-800/50 p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 shrink-0">
              <img src={logo} alt="logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 overflow-hidden whitespace-nowrap">
              <h1 className="text-lg leading-tight font-bold tracking-tight text-slate-100">
                Gold Tracker
              </h1>
              <p className="text-xs font-medium text-slate-400">Investment Portfolio</p>
            </div>
          </div>

          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <RiCloseLine className="h-5 w-5" />
          </MotionButton>

          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onToggleDesktop}
            className="-mr-2 hidden shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white lg:flex"
            aria-label="Collapse sidebar"
          >
            <RiSidebarFoldLine className="h-5 w-5" />
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
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-colors duration-200 hover:bg-slate-800/50 hover:text-slate-200"
          >
            <span className="truncate">Custom Selling Price</span>
            <Switch
              id="sell-price-override"
              checked={sellPriceOverride}
              onCheckedChange={onSellPriceOverrideChange}
            />
          </MotionLabel>
        </nav>

        <div className="w-full shrink-0 border-t border-slate-800/50 p-4">
          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <RiLogoutBoxRLine className="h-5 w-5 shrink-0" />
            Logout
          </MotionButton>
        </div>
      </aside>
    </>
  );
}
