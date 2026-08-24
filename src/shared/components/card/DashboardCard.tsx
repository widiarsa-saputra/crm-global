import { Button } from "@/components/ui/button"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type DashboardCardProps = {
    title: string
    icon: React.ReactNode
    iconBg?: string // << Tambahkan ini
    value: string
    change?: string
    changeType?: "up" | "down"
    onDetailClick?: () => void
}

export function DashboardCard({
    title,
    icon,
    iconBg,
    value,
    change,
    changeType = "up",
    onDetailClick,
}: DashboardCardProps) {
    return (
        <div className="bg-white p-3 rounded border border-slate-100 shadow-sm overflow-hidden relative group">
            <div className="flex items-start justify-between mb-2">
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-lg font-black text-falala-navy tabular-nums leading-none">{value}</h3>
                        <span className="text-[8px] font-bold text-slate-300 uppercase">Unit</span>
                    </div>
                </div>
                <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-none",
                    iconBg ?? "bg-slate-50 text-slate-400"
                )}>
                    {icon}
                </div>
            </div>
            
            <div className="flex items-center justify-between mt-1">
                {change ? (
                    <div className={cn(
                        "flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-none",
                        changeType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        <ArrowUpRight className={cn("h-2.5 w-2.5 mr-0.5", changeType === "down" && "rotate-90")} />
                        {change}
                    </div>
                ) : <div />}
                
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                    onClick={onDetailClick}
                >
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                </Button>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-50">
                <div className={cn(
                    "h-full transition-all duration-500",
                    changeType === "up" ? "bg-emerald-500/20" : "bg-red-500/20"
                )} style={{ width: '40%' }}></div>
            </div>
        </div>
    )
}