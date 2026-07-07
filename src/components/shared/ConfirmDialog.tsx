import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'אישור',
  cancelLabel = 'ביטול',
  onConfirm,
  onCancel,
  variant = 'default',
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-card rounded-2xl shadow-card-lg p-6 w-full max-w-md mx-4 animate-scale-in border border-border/50">
        {/* Top accent for danger */}
        {variant === 'danger' && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-destructive/70 rounded-t-2xl" />
        )}

        <div className="flex items-start gap-4">
          {variant === 'danger' && (
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          )}
          <div>
            <h3 className="text-lg tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground/80 mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-6 pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-border/60 hover:bg-muted/70 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-5 py-2.5 text-sm font-medium rounded-xl text-white transition-all duration-200',
              variant === 'danger'
                ? 'bg-destructive hover:bg-destructive/90 shadow-sm shadow-destructive/20'
                : 'bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
