import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function Header() {
  const user = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      {/* Left side: page context subtitle */}
      <div className="hidden sm:block">
        <span className="text-xs text-muted-foreground/70 tracking-wide">
          ניהול משק הבית
        </span>
      </div>

      {/* Right side: user menu */}
      <div className="flex items-center gap-4 mr-auto sm:mr-0">
        {/* Quick greeting — subtle */}
        <span className="hidden md:block text-sm text-muted-foreground/80 font-medium">
          {user.userName ? `ברוכה הבאה, ${user.userName.split(' ')[0]}` : 'ברוכים הבאים'}
        </span>

        {/* User avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200',
              'hover:bg-muted/70',
              menuOpen && 'bg-muted/70'
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-secondary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user.userName?.charAt(0) || 'מ'}
            </div>
            <ChevronDown className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
              menuOpen && 'rotate-180'
            )} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-card border border-border/60 rounded-xl shadow-card-lg p-1.5 animate-scale-in origin-top-left">
              <div className="px-3 py-2 border-b border-border/40">
                <p className="text-sm font-semibold">{user.userName || 'משתמש'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-1 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>התנתקות</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
