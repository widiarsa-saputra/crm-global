import { ReactNode } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

const sizeClassMap: Record<ModalSize, string> = {
    sm: "sm:max-w-[400px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[800px]",
    xl: "sm:max-w-[1000px]",
    full: "sm:max-w-full",
}

type ModalProps = {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: ReactNode
    title?: string
    description?: string
    children: ReactNode
    footer?: ReactNode
    size?: ModalSize
}

export const Modal = ({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    footer,
    size = "md",
}: ModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={`${sizeClassMap[size]} max-h-[95dvh] flex flex-col p-0 pb-3 overflow-hidden border-none shadow-2xl rounded-lg`}>
                {(title || description) && (
                    <DialogHeader className="p-4 !py-3 bg-primary text-primary-foreground !gap-0">
                        {title && <DialogTitle className="text-sm font-black uppercase tracking-tight italic">{title}</DialogTitle>}
                        {description && <DialogDescription className="text-[11px] text-primary-foreground/50">{description}</DialogDescription>}
                    </DialogHeader>
                )}
                <div className="flex-1 overflow-y-auto px-4 py-2">{children}</div>
                {footer && <DialogFooter className="px-4 py-3 bg-slate-50/30 border-t border-slate-100">{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}
