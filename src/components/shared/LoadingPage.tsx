interface Props {
  message?: string;
}

export default function LoadingPage({ message = 'טוען...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        {/* Outer ring */}
        <div className="h-12 w-12 rounded-full border-2 border-primary/20 animate-spin" />
        {/* Inner ring — spins opposite */}
        <div className="absolute inset-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
        {/* Center dot */}
        <div className="absolute inset-[14px] rounded-full bg-primary/15" />
      </div>
      <p className="mt-5 text-sm text-muted-foreground/70">{message}</p>
    </div>
  );
}
