import { MenuSection, ROUTES } from '@/router/AppRouter'
import SideBar from '@/shared/components/sidebar/SideBar'
import SidebarDrawer from '@/shared/components/sidebar/SidebarDrawer'
import TopBar from '@/shared/components/topbar/TopBar'
import {
    LayoutDashboard,

} from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels'
import React, { ElementType, useRef, useState } from 'react'

interface Props {
    children?: React.ReactNode
}

const AdminLayout: React.FC<Props> = ({ children }) => {
    const sidebarPanelRef = useRef<ImperativePanelHandle>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);



    const handleSidebarToggle = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        if (sidebarPanelRef.current) {
            if (collapsed) {
                sidebarPanelRef.current.collapse();
            } else {
                sidebarPanelRef.current.expand();
            }
        }
    };

    const handlePanelCollapse = () => {
        setIsCollapsed(true);
    };

    const handlePanelExpand = () => {
        setIsCollapsed(false);
    };

    const menuSections: MenuSection[] = [
        {
            label: 'Utama',
            items: [
                { icon: LayoutDashboard as ElementType, text: 'Dashboard', url: ROUTES.SLASH.path },
            ],
            icon: LayoutDashboard as ElementType,
            order: 1
        },

    ];

    return (
        <PanelGroup direction="horizontal" className="flex h-[100dvh] bg-gray-50">
            {/* Sidebar */}
            <Panel
                ref={sidebarPanelRef}
                defaultSize={15}
                minSize={15}
                maxSize={30}
                collapsible={true}
                collapsedSize={5}
                onCollapse={handlePanelCollapse}
                onExpand={handlePanelExpand}
                className="hidden md:block"
            >
                <SideBar 
                    menuSections={menuSections} 
                    collapsed={isCollapsed} 
                    onToggle={handleSidebarToggle} 
                />
            </Panel>
            
            <PanelResizeHandle 
                onDoubleClick={() => handleSidebarToggle(!isCollapsed)}
                className="w-[1px] bg-gray-200 hover:bg-primary/50 active:bg-primary transition-colors cursor-col-resize hidden md:block" 
            />

            {/* Main Content */}
            <Panel defaultSize={80} minSize={50} className="w-full">
                <div className="flex flex-col h-full overflow-hidden w-full">
                    <TopBar />
                    <SidebarDrawer menuSections={menuSections}>
                        {children}
                    </SidebarDrawer>
                </div>
            </Panel>
        </PanelGroup>
    )
}

export default AdminLayout
