
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTopbarContext } from '@/shared/context/TopbarActionContext';
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { ActionArea } from '../topbar/TopBar';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlignJustify, Grid } from 'lucide-react';
import { MenuSection, ROUTES } from '@/router/routeConfig';
import { UserSection } from './SidebarUserSection';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HeaderCompany } from './SidebarContent';

type ExtendedMenuSection = MenuSection & {
    isExtended?: boolean
}

type DrawerSection = Omit<ExtendedMenuSection, 'items'> & {
    items: ExtendedMenuSection[]
}

interface SidebarDrawerProps {
    menuSections: ExtendedMenuSection[];
    children: ReactNode
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ menuSections, children }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [divHeight, setDivHeight] = useState(0)

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { actions } = useTopbarContext();
    const queryClient = useQueryClient();
    const handleRefreshData = async () => {
        await queryClient.invalidateQueries();
        toast.success('Data refreshed successfully!');
    };

    const actionArea = (
        <ActionArea actions={actions} handleRefreshData={handleRefreshData} />
    )

    const groupedMenu = Object.values(
        menuSections.reduce<Record<string, DrawerSection>>((acc, section) => {
            if (!acc[section.id ?? section.label]) {
                acc[section.id ?? section.label] = {
                    ...section,
                    order: Math.min(acc[section.id ?? section.label]?.order ?? 100, section.order ?? 100),
                    items: [section],
                };
            } else {
                acc[section.id ?? section.label].items.push(section);
            }

            return acc;
        }, {})
    );

    const sortedMenu = groupedMenu.sort((a, b) => (a?.order ?? 100) - (b?.order ?? 100));


    const slicedMenu: DrawerSection[] = sortedMenu.length > 4
        ? [
            ...sortedMenu.slice(0, 4),
            {
                order: 5,
                label: 'More',
                isExtended: true,
                icon: Grid as React.ElementType,
                items: [...sortedMenu.slice(4).flatMap(item => item.items)]
            }]
        : [...sortedMenu]

    const currentMenu = slicedMenu.find(item => item.items.flatMap(head => head.items.map(head2 => head2.url)).includes(pathname))

    const middleMenu = Math.floor(slicedMenu.length / 2)
    const reordered = [...slicedMenu];

    const [first] = reordered.splice(0, 1);
    reordered.splice(middleMenu, 0, first);

    const menuLength = slicedMenu.length;
    const isEven = menuLength % 2 === 0

    useEffect(() => {
        if (divRef.current) {
            setDivHeight(divRef.current.offsetHeight);
        }
    }, []);
    return (
        <div className="flex flex-col gap-4 relative">
            <div className="overflow-y-auto md:h-[calc(100dvh-3rem)]"
                style={{
                    height:
                        window.innerWidth <= 768
                            ? `calc(100dvh - ${divHeight}px)`
                            : undefined,
                }}
            >
                <div className="w-full flex gap-4 justify-between px-4 py-2 border-b md:hidden">
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size={'sm'}
                                    className='h-8'
                                >
                                    <AlignJustify className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='start'>
                                {
                                    currentMenu?.items.map((item, idx) => {
                                        return (
                                            <React.Fragment key={idx}>
                                                <DropdownMenuGroup>
                                                    <DropdownMenuLabel className='text-[10px] text-slate-400'>
                                                        {item.label}
                                                    </DropdownMenuLabel>
                                                    {
                                                        item.items.map((item2, idx2) => (
                                                            <DropdownMenuItem onSelect={() => navigate(item2.url)} disabled={item2.url === pathname} key={idx2}>
                                                                <div className="w-full flex items-center gap-2">
                                                                    <item2.icon className='h-3 w-3 ' />
                                                                    <p className='font-semibold text-sm'>
                                                                        {item2.text}
                                                                    </p>
                                                                </div>
                                                            </DropdownMenuItem>
                                                        ))
                                                    }
                                                </DropdownMenuGroup>
                                                {
                                                    idx !== currentMenu.items.length - 1
                                                        ? <DropdownMenuSeparator />
                                                        : null
                                                }
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <p className='font-bold text-lg text-slate-600 flex-1 truncate max-[400px]:hidden'>
                            {dynamicPageFunc(pathname)}
                        </p> */}
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <HeaderCompany />
                    </div>

                    {/* Action area */}
                    <div className="flex gap-2 justify-end h-8 items-center">
                        <div className="flex min-[510px]:border-r">
                            <UserSection side='bottom' align='end' />
                        </div>
                        <Popover>
                            <PopoverTrigger className='aspect-square !rounded-full border !w-7 !h-7 flex items-center justify-center'>
                                <span>?</span>
                            </PopoverTrigger>
                            <PopoverContent side='bottom' align='end'>
                                {/* {actionArea} */}
                            </PopoverContent>
                        </Popover>
                        {actionArea}
                    </div>

                </div>
                {/* <div className="w-full px-4 py-0 border-b md:hidden">
                </div> */}

                {/* {
                        currentMenu?.items.map(item => {
                            return (
                                <Button>
                                    {item.text}
                                </Button>
                            )
                        })
                    } */}

                {children}
            </div>
            <div className="h-fit w-full border-t px-4 pt-1 pb-1 fixed bottom-0 bg-primary-foreground md:hidden" ref={divRef}>
                <div className="flex gap-3 justify-center items-center">
                    {
                        reordered.map((item, index) => {
                            const isActive = item.items.flatMap(head => head.items.map(head2 => head2.url)).includes(pathname)
                            const getFirstUrl = item.items.length > 0 && item.items[0].items.length > 0 ? item.items[0].items[0].url : ROUTES.USER_MANAGEMENT.path;
                            const mainNavigation = item.order === 1 && !isEven

                            return (
                                (
                                    <div
                                        key={index}
                                        className={cn(
                                            'flex flex-col items-center justify-center',
                                            !mainNavigation
                                                ? `flex-1 p-2 ${isActive && 'bg-primary/10 text-primary rounded-md'}`
                                                : '',
                                        )}
                                        onClick={() => navigate(getFirstUrl)}
                                    >
                                        <div className={cn(
                                            mainNavigation && 'bg-primary rounded-full w-14 aspect-square text-primary-foreground',
                                            'flex flex-col items-center justify-center gap-1'
                                        )}>
                                            <item.icon className='h-5 w-5' />
                                            {
                                                !mainNavigation
                                                && (
                                                    <p className='text-[10px] font-bold capitalize'>
                                                        {item.id ?? item.label}
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default SidebarDrawer
