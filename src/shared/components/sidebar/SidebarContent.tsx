import { Button } from '@/components/ui/button';
import { AlignJustify } from 'lucide-react';
import React, { useRef, useEffect, useCallback } from 'react'
import { OverlayScrollbarsComponent, OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import SidebarItem from './SidebarItem';
import { SidebarUserSection } from './SidebarUserSection';

interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
};

interface MenuSection {
    label: string;
    items: MenuItem[];
};

interface SidebarContentProps {
    collapsed: boolean,
    toggleSidebar: () => void,
    setCollapsed: (value: boolean) => void,
    menuSections: MenuSection[],
    isDrawer?: boolean,
}

export const HeaderCompany = () => {
    return (
        <div className="flex items-center gap-2 max-[400px]:hidden">
            {/* <Logo className="w-auto h-8" /> */}
            {/* <div className="border rounded-full border-3 border-primary bg-white w-10 h-10 flex items-center justify-center">
                <UserRoundSearch className="w-4 h-4 rounded-full text-primary" />
            </div> */}
            <div className="bg-primary text-white p-2 rounded-md font-black mr-2">CG</div>
            <div className="flex flex-col">
                <span className='h-fit text-lg uppercase text-primary'>CRM</span>
                <span className='text-[10px] text-secondary/80 -mt-1'>Customer relation management</span>
            </div>
        </div>
    )
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, toggleSidebar, setCollapsed, menuSections, isDrawer }) => {
    const scrollContainerRef = useRef<OverlayScrollbarsComponentRef>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const instance = scrollContainerRef.current?.osInstance();
        if (!instance) return;

        const { viewport } = instance.elements();
        const savedPosition = localStorage.getItem('sidebarScrollPosition');
        if (savedPosition) {
            viewport.scrollTop = parseInt(savedPosition, 10);
        }
    }, []);

    const handleScroll = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            const instance = scrollContainerRef.current?.osInstance();
            if (!instance) return;

            const { viewport } = instance.elements();
            localStorage.setItem('sidebarScrollPosition', viewport.scrollTop.toString());
        }, 300); // 300ms debounce
    }, []);

    return (
        <div className={`flex flex-col ${collapsed ? 'w-full' : isDrawer ? 'w-screen' : 'w-full'} border-r bg-primary relative h-[100dvh]`}>
            <div className={`flex h-12 ${collapsed ? 'flex-col py-2.5' : 'items-center p-2.5'} gap-2 border-b`}>
                {!collapsed && (
                    <div className="flex items-center gap-1 font-black">
                        {/* <Logo className="w-auto h-8" /> */}
                        <div className="border rounded-full border-3 border-primary bg-white w-10 h-10 flex items-center justify-center">
                            {/* <UserRoundSearch className="w-4 h-4 rounded-full text-primary" /> */}
                            <img
                                src="/logo/ic_logo.png"
                                className='w-5 h-5 object-contain'
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className='h-fit text-lg uppercase text-primary-foreground'>CRM</span>
                            <span className='text-[10px] text-secondary/80 -mt-1'><span className='text-slate-300'>Nexus</span> Education</span>
                        </div>
                    </div>
                )}
                {!isDrawer && (
                    <div className={`${collapsed ? 'flex justify-center' : 'ml-auto'}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 hover:bg-transparent ${collapsed ? 'text-white hover:text-secondary' : 'text-white hover:text-secondary'}`}
                            onClick={toggleSidebar}
                        >
                            <AlignJustify className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            {/* <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scrollnbar-gutter-stable custom-scrollbar"
            >
                <SidebarItem collapsed={collapsed} sections={menuSections} />
            </div> */}
            <OverlayScrollbarsComponent
                ref={scrollContainerRef}
                options={{
                    scrollbars: {
                        autoHide: 'leave',
                        autoHideDelay: 200,
                        theme: 'os-theme-custom',
                    },
                }}
                className="flex-1"
                events={{ scroll: handleScroll }}
            >
                <SidebarItem collapsed={collapsed} sections={menuSections} />
            </OverlayScrollbarsComponent>

            <SidebarUserSection collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
    )
}

export default SidebarContent;