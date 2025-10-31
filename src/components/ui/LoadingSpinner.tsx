import { cn } from '@/lib/utils'

type LoadingSpinnerProps = {
  className?: string
  text?: string
}

export function LoadingSpinner({ className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600" />
      {text && <p className="text-slate-600 animate-pulse">{text}</p>}
    </div>
  )
}
