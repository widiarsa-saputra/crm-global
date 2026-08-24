import { ReactNode } from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
    title?: string
    description?: string
    icon?: ReactNode
    action?: ReactNode
    className?: string
}

const EmptyState = ({
    title = "Tidak ada data",
    description = "Belum ada data yang tersedia.",
    icon,
    action,
    className,
}: EmptyStateProps) => {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
            <div className="mb-4 text-muted-foreground">
                {icon ?? <Inbox className="h-12 w-12 opacity-40" />}
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mb-4">{description}</p>
            {action && <div>{action}</div>}
        </div>
    )
}

export default EmptyState
