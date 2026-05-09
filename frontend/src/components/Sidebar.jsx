import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, LogOut, X, PanelLeftClose } from 'lucide-react';
import { cn } from '../lib/utils';
import logo from '../assets/gold.svg';
import { MotionButton } from './common/MotionWrapper';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose, isDesktopOpen = true, onToggleDesktop }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static lg:w-100',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          !isDesktopOpen && 'lg:w-0 lg:-translate-x-full lg:border-r-0 lg:p-0 lg:opacity-0',
          isDesktopOpen && 'lg:translate-x-0',
        )}
      >
        <div className="flex w-64 items-center justify-between border-b border-slate-800/50 p-6 lg:w-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10">
              <img src={logo} alt="logo" className="h-full w-full object-contain" />
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg leading-tight font-bold tracking-tight text-slate-100">Gold Tracker</h1>
              <p className="text-xs font-medium text-slate-400">Investment Portfolio</p>
            </div>
          </div>
          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </MotionButton>
          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onToggleDesktop}
            className="-mr-2 hidden shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white lg:flex"
          >
            <PanelLeftClose className="h-5 w-5" />
          </MotionButton>
        </div>

        <nav className="relative w-64 flex-1 space-y-2 p-4 lg:w-100">
          <div className="mb-4 pl-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">Menu</div>

          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 font-medium transition-all duration-200',
                isActive ? 'bg-blue-500/10 text-blue-50 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />}
                <LayoutDashboard className={cn('h-5 w-5', isActive ? 'text-blue-400' : 'text-slate-500 transition-colors group-hover:text-slate-300')} />
                Dashboard
              </>
            )}
          </NavLink>

          <NavLink
            to="/performance"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 font-medium transition-colors duration-200',
                isActive ? 'bg-cyan-500/10 text-cyan-50 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-500" />}
                <LineChart className={cn('h-5 w-5', isActive ? 'text-cyan-400' : 'text-slate-500 transition-colors group-hover:text-slate-300')} />
                Performance
              </>
            )}
          </NavLink>
        </nav>

        <div className="w-64 border-t border-slate-800/50 p-4 lg:w-100">
          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </MotionButton>
        </div>
      </aside>
    </>
  );
}
