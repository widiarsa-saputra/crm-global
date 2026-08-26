import { useAuth } from '@/auth/context/AuthProvider'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { truncateText } from '@/lib/utils'
import { ChevronDown, LogOut, User2Icon } from 'lucide-react'
import { userSections } from '@/router/routeConfig'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SidebarUserSectionProps {
    collapsed: boolean
    setCollapsed: (value: boolean) => void
}

// export interface MenuItem {
//     icon: React.ElementType;
//     text: string;
//     url: string;
//     roles?: string[];
//     permissions?: string[];
// }

export const UserSection = ({
    align = 'start',
    side = 'top'
}: {
    align?: 'start' | 'end' | 'center',
    side?: 'right' | 'left' | 'top' | 'bottom'
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full px-1.5 max-[510px]:!px-0 py-1 flex items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded text-sidebar-foreground h-auto group">
                    <div className="flex items-center gap-x-2">
                        <div className="w-7 h-7 rounded-full bg-sidebar-accent overflow-hidden border border-sidebar-border flex justify-center items-center">
                            {/* <img src={"/profile.jpg"} alt={user?.name} className="w-full h-full object-cover" /> */}
                            {
                                user?.photo_url
                                    ? <img src={user?.photo_url} alt={user?.name} className="w-full h-full object-cover" />
                                    : <User2Icon />
                            }
                        </div>
                        <div className="text-left max-[510px]:hidden">
                            <p className="text-[11px] max-md:text-primary text-white group-hover:text-primary font-black uppercase tracking-tight">{truncateText(user?.name ?? '', 20, '...')}</p>
                            <p className="text-[9px] text-white max-md:text-primary group-hover:text-primary font-bold tracking-tight">{truncateText(user?.email ?? '', 25, '...')}</p>
                        </div>
                    </div>
                    <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50 max-[510px]:hidden group-hover:text-primary text-white" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="w-60 bg-popover border border-border rounded-md text-popover-foreground p-2 shadow-xl">
                {
                    userSections.map((group, idx) => (
                        <React.Fragment key={idx}>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className='text-[10px] text-slate-400'>
                                    {group.label}
                                </DropdownMenuLabel>
                                {group.items.map((item, idx2) => (
                                    <DropdownMenuItem key={idx2} className='text-sm font-semibold' onClick={() => navigate(item.url)}>
                                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" /> {item.text}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            {
                                idx !== userSections.length - 1
                                    ? <DropdownMenuSeparator />
                                    : null
                            }
                        </React.Fragment>
                    ))
                }
                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-sm flex items-center justify-between gap-4 font-semibold capitalize hover:bg-destructive hover:text-white focus:bg-destructive focus:text-white text-destructive cursor-pointer rounded px-3 py-1.5 mt-1 group" onSelect={() => setShowLogoutDialog(true)}>
                    <span>Keluar dari Sesi</span>
                    <LogOut className='text-destructive group-hover:text-white group-focus:text-white' />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin keluar dari aplikasi? Anda perlu login kembali untuk mengakses sistem.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => logout()} className="bg-destructive hover:bg-destructive/90 text-white">
                        Ya, Keluar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}

export const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({ collapsed, setCollapsed }) => {
    const { user } = useAuth()

    return (
        <div className={`w-full bottom-0 p-2 border-t`}>
            {collapsed ? (
                <Button
                    variant="ghost"
                    className="w-full px-1.5 py-1 flex items-center justify-center hover:bg-white/5"
                    onClick={() => setCollapsed(false)}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                            <img src={user?.photo_url || "/profile.jpg"} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </Button>
            ) : (
                <UserSection />
            )}
        </div>
    )
}
