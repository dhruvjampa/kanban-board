import { cn } from '../../utils/cn.ts'

interface BadgeProps {
  label: string
  variant?: 'high' | 'normal' | 'low' | 'overdue' | 'soon' | 'default'
  className?: string
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variant === 'high'    && 'bg-rose-500/20 text-rose-400',
      variant === 'normal'  && 'bg-blue-500/20 text-blue-400',
      variant === 'low'     && 'bg-slate-500/20 text-slate-400',
      variant === 'overdue' && 'bg-rose-500/20 text-rose-400',
      variant === 'soon'    && 'bg-amber-500/20 text-amber-400',
      variant === 'default' && 'bg-slate-700 text-slate-300',
      className
    )}>
      {label}
    </span>
  )
}