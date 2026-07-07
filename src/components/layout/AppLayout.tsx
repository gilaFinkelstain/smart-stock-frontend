import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../store/hooks';
import { cn } from '../../lib/utils';

export default function AppLayout() {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:mr-64' : 'lg:mr-20'
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* Subtle footer */}
        <footer className="py-3 px-6 border-t border-border/40 text-center text-xs text-muted-foreground/50">
          Smart Stock — ניהול משק בית חכם
        </footer>
      </div>
    </div>
  );
}
