import React, { useState } from 'react'
import SidebarContent from './SidebarContent'

interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
};

interface MenuSection {
    label: string;
    items: MenuItem[];
};

interface SidebarProps {
    menuSections: MenuSection[];
    collapsed?: boolean;
    onToggle?: (collapsed: boolean) => void;
}

const SideBar: React.FC<SidebarProps> = ({ menuSections, collapsed: controlledCollapsed, onToggle }) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false)
    
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const toggleSidebar = () => {
        if (isControlled && onToggle) {
            onToggle(!collapsed);
        } else {
            setInternalCollapsed(prev => !prev);
        }
    }

    const handleSetCollapsed = (val: boolean) => {
        if (isControlled && onToggle) {
            onToggle(val);
        } else {
            setInternalCollapsed(val);
        }
    }

    return (
        <div className="hidden md:block h-full w-full" >
            <SidebarContent
                collapsed={collapsed}
                toggleSidebar={toggleSidebar}
                setCollapsed={handleSetCollapsed}
                menuSections={menuSections}
            />
        </div>
    )
}

export default SideBar