import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { RiMenuLine } from '@remixicon/react';
import Logo from '../common/Logo';
import { MotionButton } from '../common/MotionWrapper';

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen overflow-hidden bg-transparent text-slate-200 selection:bg-blue-500/30">
      <div className="relative z-10 flex h-screen w-full flex-col overflow-hidden lg:flex-row">
        <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-md lg:hidden">
          <h1 className="flex items-center gap-4 text-lg font-bold tracking-tight text-slate-100">
            <Logo size={32} />
            Gold Tracker
          </h1>
          <MotionButton
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            <RiMenuLine className="h-6 w-6" />
          </MotionButton>
        </div>

        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          isDesktopOpen={desktopSidebarOpen}
          onToggleDesktop={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
        />

        <main className="relative flex h-dvh w-full flex-1 flex-col overflow-hidden transition-all duration-300 lg:h-screen">
          <div className="h-full overflow-y-auto p-4 md:p-8">
            <Outlet
              context={{
                sidebarClosed: !desktopSidebarOpen,
                onOpenSidebar: () => setDesktopSidebarOpen(true),
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
