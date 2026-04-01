import { cn } from '../../utils/cn'
import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2',
          'text-sm text-slate-100 placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  )
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2',
          'text-sm text-slate-100 placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed resize-none',
          error && 'border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  )
}