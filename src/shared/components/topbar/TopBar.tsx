/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TopbarActions, useTopbarContext } from '@/shared/context/TopbarActionContext'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Download,
    Search,
    Filter,
    RefreshCw,
    FilterX,
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { dynamicPageFunc, cn } from '@/lib/utils'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { VariantProps } from 'class-variance-authority'

// interface TopBarProps {
//     menuSections?: any[];
// }

type HoverButtonProps = HTMLMotionProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        text: string;
        icon: React.ElementType;
        activeButtonId?: string;
        setActiveButtonId: (id: string) => void;
    };

const MotionButton = motion.create(Button);
export const HoverButton = ({
    text,
    icon,
    className,
    id,
    activeButtonId,
    setActiveButtonId,
    ...props
}: HoverButtonProps) => {
    const Icon = icon;
    return (
        <MotionButton
            layout
            transition={{ layout: { duration: 0.25, ease: "easeOut" } }}
            {...props}
            variant={'ghost'} className={
                cn(
                    '!p-2 rounded-full flex justify-center items-center w-fit h-fit',
                    activeButtonId === id && 'md:bg-slate-200 hover:md:bg-slate-200',
                    className,
                )
            }
            onMouseEnter={() => {
                setActiveButtonId(id ?? 'create')
            }}
        >
            <motion.div layout className="flex items-center gap-2">
                <motion.div layout>
                    <Icon className="w-4 h-4" />
                </motion.div>

                <AnimatePresence mode="wait">
                    {activeButtonId === id && (
                        <motion.span
                            layout
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden whitespace-nowrap text-xs max-md:hidden"
                        >
                            {text}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </MotionButton>
    )
}

export const ActionArea = ({
    actions,
    handleRefreshData
}: {
    actions: TopbarActions | null,
    handleRefreshData?: () => void
}) => {
    const [activeButtonId, setActiveButtonId] = useState('search')
    const [isLgOrBelow, setIsLgOrBelow] = React.useState(false);

    React.useEffect(() => {
        const checkLg = () => setIsLgOrBelow(window.innerWidth < 1024);
        checkLg();
        window.addEventListener('resize', checkLg);
        return () => window.removeEventListener('resize', checkLg);
    }, []);

    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [tempSearch, setTempSearch] = React.useState(actions?.search?.value || "");

    // Update tempSearch whenever actions.search.value changes from outside (e.g., reset)
    React.useEffect(() => {
        if (actions?.search) {
            setTempSearch(actions.search.value);
        }
    }, [actions?.search?.value]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (actions?.search) {
            actions.search.onChange(tempSearch);
        }
        setIsSearchOpen(false);
    };

    return (
        <div className="flex items-center gap-2 w-full justify-end">
            {/* Global Search (if provided by page) */}
            {actions?.search && (
                <div className="transition-all duration-300">
                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <DialogTrigger asChild>
                            {/* <Button
                                variant="outline"
                                className="justify-center text-xs border-slate-200 bg-slate-50/50 hover:bg-white text-slate-400 font-normal !p-1 h-8 shadow-sm flex gap-2 rounded-full aspect-square"
                            >
                                <Search className="!h-4 !w-4" />
                                <span className="lg:block hidden">{actions.search.value || actions.search.placeholder || "Cari sesuatu..."}</span>
                            </Button> */}
                            <HoverButton
                                text={actions.search.value || actions.search.placeholder || "Cari sesuatu..."}
                                icon={Search}
                                id="search"
                                activeButtonId={activeButtonId}
                                setActiveButtonId={setActiveButtonId}
                            />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleSearchSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Pencarian</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        placeholder={actions.search.placeholder || "Ketik kata kunci pencarian..."}
                                        value={tempSearch}
                                        onChange={(e) => setTempSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsSearchOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit">Cari</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {/* Filter Drawer (if provided by page) */}
            {actions?.filter && (
                <Sheet>
                    <SheetTrigger asChild>
                        {/* <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 border-slate-200 text-slate-600 font-bold uppercase text-[9px] tracking-widest rounded hover:bg-primary hover:text-white transition-all duration-200 shadow-sm"
                        >
                            <Filter className="h-3 w-3" />
                            <span className='max-md:hidden'>Filter</span>
                        </Button> */}
                        <HoverButton
                            text='Filter'
                            icon={Filter}
                            id="filter"
                            activeButtonId={activeButtonId}
                            setActiveButtonId={setActiveButtonId}
                        />
                    </SheetTrigger>
                    <SheetContent
                        side={isLgOrBelow ? "bottom" : "right"}
                        className={cn(
                            "p-0 shadow-2xl overflow-hidden",
                            isLgOrBelow
                                ? "h-[85vh] w-full rounded-t-xl"
                                : "w-[400px] sm:w-[540px] border-l-slate-100 rounded-l-xl"
                        )}
                    >
                        <div className="flex flex-col h-full">
                            <SheetHeader className="p-6 bg-slate-50/80 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <SheetTitle className="text-lg font-black uppercase italic tracking-tight text-primary">
                                            Advance Filter
                                        </SheetTitle>
                                        <SheetDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                                            Sesuaikan pencarian data Anda
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {actions.filter.content}
                            </div>

                            <SheetFooter className="p-6 bg-slate-50/80 border-t border-slate-100 flex-row gap-3 sm:justify-end">
                                <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none h-11 px-6 rounded font-black uppercase text-[11px] tracking-widest text-slate-500 border-slate-200"
                                    onClick={actions.filter.onClear}
                                >
                                    <FilterX className="mr-2 h-4 w-4" />
                                    Reset Filter
                                </Button>
                                <SheetClose asChild>
                                    <Button
                                        className="flex-1 sm:flex-none h-11 px-8 rounded font-black uppercase text-[11px] tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                                        onClick={actions.filter.onApply}
                                    >
                                        Terapkan
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            {/* Download Action (if provided by page) */}
            {actions?.download && (
                // <Button
                //     variant="outline"
                //     size="sm"
                //     onClick={actions.download.onDownload}
                //     className="h-8 gap-1.5 text-slate-600 font-bold uppercase text-[9px] tracking-widest rounded hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200"
                // >
                //     <Download className="h-3 w-3" />
                //     <span className="hidden sm:inline">{actions.download.label || "Export"}</span>
                // </Button>
                <HoverButton
                    icon={Download}
                    text={actions.download.label || "Export"}
                    onClick={actions.download.onDownload}
                    id="export"
                    activeButtonId={activeButtonId}
                    setActiveButtonId={setActiveButtonId}
                />
            )}

            {/* Extra Actions */}
            {actions?.extraActions}


            {/* Vertical Divider */}
            {/* <div className="w-[1px] h-5 bg-slate-100 mx-1 hidden sm:block" /> */}

            {/* Standard Topbar Actions */}
            {/* <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shadow-sm rounded hover:text-primary hover:bg-primary/5 transition-colors"
                onClick={handleRefreshData}
            >
                <RefreshCw className="h-3.5 w-3.5" />
            </Button> */}
            <HoverButton
                icon={RefreshCw}
                onClick={handleRefreshData}
                text='Refresh'
                id="refresh"
                activeButtonId={activeButtonId}
                setActiveButtonId={setActiveButtonId}
            />

            {/* <NotificationBell />
            <LanguageDropdown /> */}
        </div>
    )
}


const TopBar: React.FC = () => {
    const location = useLocation()
    const { actions } = useTopbarContext()

    // Ambil bagian terakhir dari path dan formatnya
    const dynamicPageTitle = dynamicPageFunc(location.pathname)
    // location.pathname === '/'
    //     ? 'Dashboard'
    //     : location.pathname
    //         .split('/')
    //         .pop()
    //         ?.replace(/-/g, ' ')
    //         .replace(/\b\w/g, (char) => char.toUpperCase());

    const queryClient = useQueryClient();
    const handleRefreshData = async () => {
        await queryClient.invalidateQueries();
        toast.success('Data refreshed successfully!');
    };

    const actionArea = <ActionArea actions={actions} handleRefreshData={handleRefreshData} />

    return (
        <header className="max-md:hidden sticky top-0 z-30 flex h-12 items-center justify-between border-b bg-white/80 backdrop-blur-md px-3 md:px-4 h-12">
            <div className="flex items-center gap-2 md:gap-3">
                {/* Mobile Menu Trigger */}
                {/* <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                                <AlignJustify className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 h-[100dvh] w-screen max-w-[100vw] sm:max-w-sm md:max-w-md lg:max-w-lg rounded-none border-none">
                            <SidebarContent
                                collapsed={false}
                                toggleSidebar={() => {}} // Controlled by Sheet state internally
                                setCollapsed={() => { }}
                                menuSections={menuSections}
                                isDrawer={true}
                            />
                        </SheetContent>
                    </Sheet>
                </div> */}

                <h1 className="text-xs md:text-sm font-black tracking-tight uppercase text-primary leading-none truncate max-w-[150px] md:max-w-none">
                    {dynamicPageTitle}
                </h1>
            </div>

            {/* Actions Area */}
            {actionArea}
        </header>
    )
}

export default TopBar;