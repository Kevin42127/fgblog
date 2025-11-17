import { createContext, useContext, useState, ReactNode } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || '確認',
        message: options.message,
        confirmText: options.confirmText || '確認',
        cancelText: options.cancelText || '取消',
        resolve
      })
    })
  }

  const handleConfirm = () => {
    if (dialogState) {
      dialogState.resolve(true)
      setDialogState(null)
    }
  }

  const handleCancel = () => {
    if (dialogState) {
      dialogState.resolve(false)
      setDialogState(null)
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogState && (
        <ConfirmDialog
          isOpen={dialogState.isOpen}
          title={dialogState.title}
          message={dialogState.message}
          confirmText={dialogState.confirmText}
          cancelText={dialogState.cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return context
}

