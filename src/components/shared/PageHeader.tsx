import { cn } from '../../lib/utils';

interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, children, className }: Props) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2.5 shrink-0">
            {children}
          </div>
        )}
      </div>
      <hr className="divider-warm mt-5" />
    </div>
  );
}
