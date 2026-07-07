import { useState, useRef, useCallback } from 'react';
import { Upload, File, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  onUpload: (file: File) => void;
  progress: number | null;
  accept?: string;
  disabled?: boolean;
}

export default function FileUploader({
  onUpload,
  progress,
  accept = '.pdf,.json,.txt',
  disabled = false,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && !disabled) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
          dragOver
            ? 'border-primary/60 bg-primary/5 scale-[1.01]'
            : 'border-border/60 hover:border-primary/30 hover:bg-muted/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
        />

        {/* Decorative icon */}
        <div className={cn(
          'inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4 transition-all duration-300',
          dragOver ? 'bg-primary/15 scale-110' : 'bg-muted/60'
        )}>
          <Upload className={cn(
            'h-7 w-7 transition-colors duration-300',
            dragOver ? 'text-primary' : 'text-muted-foreground/40'
          )} />
        </div>

        <p className="font-medium text-sm">
          {dragOver ? 'שחרר את הקובץ כאן' : 'גרור קובץ קבלה לכאן או לחץ לבחירה'}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1.5">
          קבצי PDF, JSON או טקסט
        </p>
      </div>

      {/* Selected file info */}
      {selectedFile && (
        <div className={cn(
          'mt-3 flex items-center gap-3 px-4 py-3 rounded-xl',
          'bg-muted/60 border border-border/40',
          'animate-slide-up'
        )}>
          <div className={cn(
            'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
            progress === 100 ? 'bg-accent/15' : 'bg-primary/10'
          )}>
            {progress === 100 ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <File className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            {progress !== null && progress < 100 && (
              <p className="text-xs text-muted-foreground/60">{progress}% הועלה</p>
            )}
            {progress === 100 && (
              <p className="text-xs text-accent/80">הועלה בהצלחה</p>
            )}
          </div>
          {progress === 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Progress bar */}
      {progress !== null && progress < 100 && (
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
            }}
          />
        </div>
      )}
    </div>
  );
}
