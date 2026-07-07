import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Package,
  Tags,
  Clock,
  Receipt,
  ShoppingCart,
  Link,
  BarChart3,
  Menu,
  ChevronLeft,
  Home,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';

const links = [
  { to: '/', label: 'דשבורד', icon: Home },
  { to: '/products', label: 'מוצרים', icon: Package },
  { to: '/categories', label: 'קטגוריות', icon: Tags },
  { to: '/ranges', label: 'טווחי קניה', icon: Clock },
  { to: '/receipts', label: 'קבלות', icon: Receipt },
  { to: '/shopping-list', label: 'רשימת קניות', icon: ShoppingCart },
  { to: '/product-range', label: 'שיוך מוצרים', icon: Link },
  { to: '/statistics', label: 'סטטיסטיקה', icon: BarChart3 },
];

export default function Sidebar() {
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 lg:hidden rounded-xl border border-border/60 bg-card shadow-card p-2.5 hover:shadow-card-hover transition-all duration-200"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="תפריט"
      >
        <Menu className="h-5 w-5 text-foreground/70" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-40 h-full flex flex-col',
          'bg-gradient-to-b from-[#3D2E24] to-[#2D2220] text-white',
          'shadow-xl transition-all duration-300 ease-in-out',
          open
            ? 'w-64 translate-x-0'
            : 'w-64 -translate-x-full lg:w-20 lg:translate-x-0'
        )}
      >
        {/* Logo area */}
        <div className="flex items-center h-16 px-4 shrink-0">
          <div className={cn(
            'flex items-center gap-3 overflow-hidden',
            !open && 'lg:justify-center lg:w-full'
          )}>
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span
              className={cn(
                'text-lg tracking-tight whitespace-nowrap',
                'font-display font-bold text-white/95',
                !open && 'lg:hidden'
              )}
            >
              Smart Stock
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 p-3 mt-2 flex-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                  'hover:bg-white/10',
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-white/65 hover:text-white/90',
                  !open && 'lg:justify-center lg:px-0 lg:py-3'
                )
              }
            >
              <Icon className={cn('h-5 w-5 shrink-0 transition-transform duration-200')} />
              <span className={cn('whitespace-nowrap', !open && 'lg:hidden')}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden lg:flex items-center justify-center h-12 mx-3 mb-4 rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
          aria-label={open ? 'כווץ תפריט' : 'הרחב תפריט'}
        >
          <ChevronLeft className={cn(
            'h-4 w-4 transition-transform duration-300',
            !open && 'rotate-180'
          )} />
        </button>
      </aside>
    </>
  );
}
