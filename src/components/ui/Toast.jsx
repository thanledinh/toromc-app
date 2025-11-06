import { CheckIcon, AlertIcon } from '../icons'

const Toast = ({ toast, onClose }) => {
  if (!toast) return null

  return (
    <div className="fixed right-6 top-24 z-[60]">
      <div
        className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur ${
          toast.tone === 'success'
            ? 'border-amber-400/50 bg-amber-500/15 text-amber-100'
            : 'border-rose-400/50 bg-rose-500/10 text-rose-100'
        }`}
      >
        {toast.tone === 'success' ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <AlertIcon className="h-4 w-4" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  )
}

export default Toast
