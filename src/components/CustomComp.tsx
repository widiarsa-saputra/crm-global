import { cn } from "@/lib/utils";
import { Globe, Plus, List } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ButtonListTabsProps = { options: string[], value: string, onChange: (value: string) => void, className?: string }

export const ButtonListTabs = ({
    options,
    value,
    onChange,
    className
}: ButtonListTabsProps) => {
    const renderLabel = (option: string) => {
        return option === 'all'
            ? 'Semua'
            : option.split(" ").length > 1
                ? option.split(" ").map((word, idx) => idx === 0 ? word.slice(0, 2) : word).join(". ")
                : option;
    };

    return (
        <>
            <div className={cn("hidden md:flex items-center gap-1 p-1 overflow-x-auto w-fit rounded-lg bg-slate-100", className)}>
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`px-3 py-1.5 text-xs capitalize font-semibold rounded-lg transition-all ${value === option ? 'text-primary bg-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        {renderLabel(option)}
                    </button>
                ))}
            </div>

            <div className={cn("md:hidden flex", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200">
                            <List className="w-4 h-4" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-48 p-1">
                        <div className="flex flex-col gap-1">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => onChange(option)}
                                    className={`px-3 py-2 text-left text-xs capitalize font-semibold rounded-md transition-all ${value === option ? 'text-primary bg-slate-100' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {renderLabel(option)}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}
type AddButtonProps = { onClick: () => void, title?: string, className?: string }

export const AddButton = ({ onClick, title, className }: AddButtonProps) => {
    return (
        <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-5 py-2 rounded-xl hover:shadow-primary/30 transition-all active:scale-95 duration-200", className)}>
            <Plus className="w-4 h-4" />
            <span className="max-md:hidden">{title ?? 'Tambah Data'}</span>
        </button>
    )
}

type SwtichViewProps<T> = { onChange: (val: T) => void, value: string, className?: string, options: { text?: string, icon: React.ElementType, id: T }[] }

export const SwitchView = <T extends string>({
    onChange,
    value,
    className,
    options
}: SwtichViewProps<T>) => {
    return (
        <div className={cn("flex items-center bg-slate-100 p-1 rounded-xl", className)}>
            {
                options.map(opt => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onChange(opt.id)}
                            title="Tampilan Kartu Grid"
                            className={`p-1.5 group text-xs font-medium rounded-lg flex items-center transition-all ${value === opt.id ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Icon className="w-4 h-4 px-0.5" />
                            <span
                                className={cn(
                                    'max-md:hidden capitalize',
                                    value !== opt.id
                                        ? 'hidden group-hover:inline'
                                        : 'inline'
                                )}
                            >
                                {opt.text ?? opt.id}
                            </span>
                        </button>
                    )
                })
            }
        </div>
    )
}

export const LoadingCard = ({ isLoading }: { isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                        <div className="h-5 bg-slate-200 rounded w-1/2 mb-4"></div>
                        <div className="border-t border-slate-100 mt-4 pt-4">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

type EmptyListProps = { isEmpty: boolean, reset?: () => void, icon?: React.ElementType, title?: string, desc?: string }
export const EmptyList = ({ isEmpty, reset, icon, title, desc }: EmptyListProps) => {
    const Icon = icon ?? Globe;
    if (isEmpty) {
        return (
            <div className="flex-grow text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{title ?? 'Tidak ada data ditemukan'}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{desc ?? 'Coba sesuaikan kata kunci pencarian atau ganti filter continent Anda.'}</p>
                {reset && (
                    <button onClick={() => reset?.()} className="mt-4 text-xs font-semibold text-primary hover:text-primary/90 bg-slate-100 px-4 py-2 rounded-xl transition-colors">
                        Reset Semua Filter
                    </button>
                )}
            </div>
        )
    }
}