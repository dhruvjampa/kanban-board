import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = 'hidden'
    
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    
    return () => {
      // Restore background scroll on unmount
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])
  
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
      {/* Header — always visible */}
      <div className="flex items-start justify-between px-6 py-4 border-b border-slate-700 flex-shrink-0">
        <h2 className="text-base font-semibold text-slate-100 min-w-0 pr-4 flex-1 truncate">
          {title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
      {/* Body — scrolls internally if content is too tall */}
      <div className="px-6 py-4 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
)
  
}