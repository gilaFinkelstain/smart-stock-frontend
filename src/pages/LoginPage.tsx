import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginThunk, registerThunk, clearError } from '../store/slices/authSlice';
import { ShoppingCart, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn } = useAppSelector((s) => s.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (isRegister) {
      const result = await dispatch(registerThunk({ name, email, password }));
      if (registerThunk.fulfilled.match(result)) {
        navigate('/');
      }
    } else {
      const result = await dispatch(loginThunk({ email, password }));
      if (loginThunk.fulfilled.match(result)) {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-5 shadow-lg shadow-primary/20">
            <ShoppingCart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Stock</h1>
          <p className="mt-2 text-sm text-muted-foreground/70">
            ניהול חכם למשק הבית
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border/50 rounded-2xl p-7 shadow-card-lg animate-slide-up"
        >
          <h2 className="text-xl font-semibold text-center mb-6 tracking-tight">
            {isRegister ? 'הצטרפות ל-Smart Stock' : 'ברוכים השבים'}
          </h2>

          {error && (
            <div className="bg-destructive/8 text-destructive text-sm rounded-xl p-3.5 text-center mb-5 border border-destructive/15">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">שם</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/40"
                  placeholder="ישראל ישראלי"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">אימייל</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/40"
                placeholder="israel@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={3}
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/40"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 text-sm font-semibold hover:opacity-95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-primary/15 active:scale-[0.99]"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRegister ? 'הצטרפות' : 'התחברות'}
          </button>

          <p className="text-center text-sm text-muted-foreground/60 mt-5">
            {isRegister ? 'כבר יש לך חשבון?' : 'עדיין אין לך חשבון?'}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); dispatch(clearError()); }}
              className="text-primary font-semibold hover:underline transition-all"
            >
              {isRegister ? 'התחברות' : 'הרשמה'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
