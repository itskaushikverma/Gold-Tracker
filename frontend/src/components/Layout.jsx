import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, PanelLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import logo from '../assets/gold.svg';
import { MotionButton } from './common/MotionWrapper';

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen overflow-hidden bg-transparent font-sans text-slate-200 selection:bg-blue-500/30">
      <div className="relative z-10 flex h-screen w-full flex-col overflow-hidden lg:flex-row">
        <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-md lg:hidden">
          <h1 className="flex items-center gap-4 text-lg font-bold tracking-tight text-slate-100">
            <div className="h-8 w-8">
              <img src={logo} alt="logo" className="h-full w-full object-contain" />
            </div>
            Gold Tracker
          </h1>
          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </MotionButton>
        </div>

        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} isDesktopOpen={desktopSidebarOpen} onToggleDesktop={() => setDesktopSidebarOpen(!desktopSidebarOpen)} />

        <main className={cn('relative h-dvh w-full flex-1 overflow-y-auto transition-all duration-300 lg:h-screen', !desktopSidebarOpen ? 'lg:pl-0' : '')}>
          {!desktopSidebarOpen && (
            <MotionButton
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={() => setDesktopSidebarOpen(true)}
              className="fixed top-6 left-6 z-40 hidden rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-400 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-800 hover:text-white lg:flex"
            >
              <PanelLeft className="h-5 w-5" />
            </MotionButton>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
