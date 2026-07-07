interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  title = 'אין נתונים',
  description = 'לא נמצאו נתונים להצגה',
  children,
}: Props) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 mb-5">
        <svg className="h-7 w-7 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-xl tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground/70 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
