import { cn } from '../../utils/cn'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-xs gap-1.5',
        size === 'md' && 'px-4 py-2 text-sm gap-2',
        variant === 'primary' && 'bg-violet-600 hover:bg-violet-500 text-white',
        variant === 'ghost'   && 'bg-transparent hover:bg-slate-700 text-slate-400 hover:text-slate-100',
        variant === 'danger'  && 'bg-transparent hover:bg-rose-500/20 text-slate-400 hover:text-rose-400',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}