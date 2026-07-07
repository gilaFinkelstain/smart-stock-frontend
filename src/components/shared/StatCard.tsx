import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'accent' | 'urgent';
}

const variants = {
  default: {
    iconBg: 'bg-muted',
    iconColor: 'text-foreground/60',
    accentClass: 'from-muted via-muted to-muted',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    accentClass: 'from-primary via-primary to-secondary',
  },
  accent: {
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    accentClass: 'from-accent via-accent to-accent/60',
  },
  urgent: {
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    accentClass: 'from-destructive via-destructive to-destructive/60',
  },
};

export default function StatCard({ title, value, icon: Icon, description, className, variant = 'default' }: Props) {
  const v = variants[variant];

  return (
    <div className={cn(
      'relative bg-card border border-border/50 rounded-xl p-5',
      'shadow-card hover:shadow-card-hover transition-all duration-300',
      'group overflow-hidden animate-slide-up',
      className
    )}>
      {/* Top accent strip */}
      <div className={cn(
        'absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-l rounded-t-xl opacity-80',
        variant !== 'default' && v.accentClass
      )} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground/70 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground/60 mt-0.5">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center shrink-0',
            'transition-all duration-300 group-hover:scale-110',
            v.iconBg
          )}>
            <Icon className={cn('h-5 w-5', v.iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
