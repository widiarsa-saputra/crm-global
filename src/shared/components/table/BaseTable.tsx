import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, onCopy } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Columns, Eye, EyeOff, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export interface Column<T> {
    title: React.ReactNode;
    key: keyof T | string;
    render?: (item: T, index: number) => React.ReactNode;
    className?: string;
    visible?: boolean;
    sortable?: boolean;
    sortKey?: string;
    expand?: boolean;
    copyValue?: boolean;
}

interface BaseTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    skeletonRows?: number;
    tableName?: string;
    renderHeader?: () => React.ReactNode;
    className?: string;
    renderBody?: (data: T[]) => React.ReactNode;
    enableColumnToggle?: boolean;
    columnToggleComponent?: React.ReactNode;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc' | null;
    onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function useColumnToggle<T>(columns: Column<T>[], initialVisibleColumns?: Set<string | keyof T>) {
    const [visibleColumns, setVisibleColumns] = useState<Set<string | keyof T>>(() =>
        initialVisibleColumns || new Set(columns.filter(col => col.visible !== false).map(col => col.key))
    );

    const toggleColumn = (key: string | keyof T) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const filteredColumns = useMemo(() =>
        columns.filter(col => visibleColumns.has(col.key)),
        [columns, visibleColumns]
    );

    const renderColumnToggle = () => {
        const allVisible = columns.every(col => visibleColumns.has(col.key));
        const noneVisible = columns.every(col => !visibleColumns.has(col.key));

        return (
            <TooltipProvider>
                <Popover>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 h-8 text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    <Columns className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Columns</span>
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="bg-primary text-white border-none text-[10px] font-bold uppercase tracking-widest">
                            <p>Show/Hide Columns</p>
                        </TooltipContent>
                    </Tooltip>
                    <PopoverContent className="w-64 p-0 rounded-xl shadow-2xl border-slate-100 overflow-hidden" align="end">
                        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                            <h4 className="font-black text-[11px] uppercase tracking-tight text-primary italic">Column Visibility</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                Atur visibilitas kolom tabel
                            </p>
                        </div>
                        <div className="p-2">
                            <div className="flex items-center justify-between mb-2 px-2 py-1">
                                <span className="text-[10px] font-black uppercase text-slate-500">Toggle All</span>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setVisibleColumns(new Set(columns.map(col => col.key)))}
                                        disabled={allVisible}
                                        className="h-6 px-2 text-[9px] font-bold uppercase text-primary hover:bg-primary/5 rounded"
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        Show All
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setVisibleColumns(new Set())}
                                        disabled={noneVisible}
                                        className="h-6 px-2 text-[9px] font-bold uppercase text-rose-500 hover:bg-rose-50 rounded"
                                    >
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Hide All
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-0.5 max-h-64 overflow-y-auto p-1 custom-scrollbar">
                                {columns.map(col => (
                                    <div
                                        key={col.key as string}
                                        className="flex items-center space-x-3 px-2.5 py-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                                        onClick={() => toggleColumn(col.key)}
                                    >
                                        <Checkbox
                                            id={`col-${col.key as string}`}
                                            checked={visibleColumns.has(col.key)}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded pointer-events-none"
                                        />
                                        <label
                                            className="text-[10px] font-bold uppercase tracking-tight text-slate-600 group-hover:text-primary cursor-pointer flex-1"
                                        >
                                            {typeof col.title === 'string' ? col.title : (col.key as string).replace('_', ' ')}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </TooltipProvider>
        );
    };

    return {
        visibleColumns,
        filteredColumns,
        toggleColumn,
        renderColumnToggle,
        setVisibleColumns
    };
}

export function BaseTable<T extends { id?: string | number }>({
    columns,
    data,
    isLoading,
    skeletonRows = 5,
    tableName,
    renderHeader,
    className,
    renderBody,
    enableColumnToggle = false,
    columnToggleComponent,
    sortBy = "created_at",
    sortOrder = "desc",
    onSort
}: BaseTableProps<T>) {
    const { filteredColumns, renderColumnToggle } = useColumnToggle(columns);

    return (
        <>
            <div className={cn("bg-white rounded border", className)}>
                {(renderHeader || tableName) && (
                    <div className="flex items-center justify-between px-6 py-2 border-b gap-2">
                        {renderHeader ? renderHeader() : <h2 className="text-lg font-medium">{tableName}</h2>}
                        {columnToggleComponent || (enableColumnToggle && renderColumnToggle())}
                    </div>
                )}
                <div className="overflow-x-auto transition-colors duration-200 ease-in-out has-[.child:hover]:!bg-sprimary/10" >
                    <Table className="w-full table-auto">
                        <TableHeader>
                            <TableRow className="border-b bg-primary/5">
                                {filteredColumns.map((col) => {
                                    const isSorted = sortBy === (col.sortKey || col.key);

                                    return (
                                        <TableHead
                                            key={col.key as string}
                                            className={cn(
                                                "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                col.sortable && "cursor-pointer hover:bg-slate-50 transition-colors select-none",
                                                col.className, 
                                                col.expand && 'w-full'
                                            )}
                                            onClick={() => {
                                                if (col.sortable && onSort) {
                                                    const newOrder = (isSorted && sortOrder === 'asc') ? 'desc' : 'asc';
                                                    onSort((col.sortKey || col.key) as string, newOrder);
                                                }
                                            }}
                                        >
                                            <div className={cn("flex items-center gap-1.5", col.className, col.key === 'action' && 'justify-end')}>
                                                {col.title}
                                                {col.sortable && (
                                                    <div className="flex flex-col">
                                                        {isSorted ? (
                                                            sortOrder === 'asc' ? (
                                                                <ChevronUp className="h-3 w-3 text-primary" />
                                                            ) : (
                                                                <ChevronDown className="h-3 w-3 text-primary" />
                                                            )
                                                        ) : (
                                                            <ChevronsUpDown className="h-3 w-3 text-gray-300" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                // Skeleton logic tetap sama
                                Array.from({ length: skeletonRows }).map((_, i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        {filteredColumns.map((_col, j) => (
                                            <TableCell key={`skeleton-cell-${j}`} className="px-6 py-4 whitespace-nowrap">
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : data.length === 0 ? (
                                // "Data Not Found" logic tetap sama
                                <TableRow>
                                    <TableCell colSpan={filteredColumns.length} className="px-6 py-1 text-center text-sm text-gray-500">
                                        Data Not Found
                                    </TableCell>
                                </TableRow>
                            ) : // --- START: Perubahan Logika Rendering ---
                                // Jika renderBody ada, gunakan itu.
                                // Jika tidak, gunakan logika lama untuk kompatibilitas ke belakang.
                                renderBody ? (
                                    renderBody(data)
                                ) : (
                                    data.map((item, index) => (
                                        <TableRow key={item.id || index} className="transition-colors duration-200 ease-in-out has-[.child:hover]:!bg-primary/5 h-px !p-0">
                                            {filteredColumns.map((col, colIndex) => (
                                                <TableCell key={(col.key as string) || colIndex} className={cn("!p-0 child transition-colors duration-200 ease-in-out whitespace-nowrap text-sm text-gray-900 group h-px", col.className)}>
                                                    <div className="w-full h-full group-hover:rounded group-hover:!bg-white group-hover:shadow-md px-6 py-1 flex items-center" onClick={() => {
                                                        if(col.copyValue === undefined || col.copyValue === true) {
                                                            onCopy(item[col.key as keyof T]?.toString() || "")
                                                        }
                                                    }}>
                                                        {col.render ? col.render(item, index) : (item[col.key as keyof T] as React.ReactNode)}
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                    // --- END: Perubahan Logika Rendering ---
                                )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}