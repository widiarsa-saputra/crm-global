import { ReactNode } from "react"
import {
    AlertDialog as AlertDialogPrimitive,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type AlertDialogProps = {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: ReactNode
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm?: () => void
    onCancel?: () => void
    isLoading?: boolean
}

const AlertDialog = ({
    open,
    onOpenChange,
    trigger,
    title = "Apakah Anda yakin?",
    description = "Tindakan ini tidak dapat dibatalkan.",
    confirmLabel = "Ya, Lanjutkan",
    cancelLabel = "Batal",
    onConfirm,
    onCancel,
    isLoading,
}: AlertDialogProps) => {
    return (
        <AlertDialogPrimitive open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Memproses..." : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogPrimitive>
    )
}

export default AlertDialog
