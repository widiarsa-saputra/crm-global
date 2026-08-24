import React from 'react';
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/auth/context/AuthProvider';


interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
    roles?: string[];
    permissions?: string[];
}

interface MenuSection {
    label: string;
    items: MenuItem[];
};

interface SidebarProps {
    collapsed: boolean;
    sections: MenuSection[];
};


const SidebarItem: React.FC<SidebarProps> = ({ collapsed, sections }) => {
    const { hasRole, hasPermission } = useAuth();

    const shortenLabel = (label: string) => {
        const labelMap: Record<string, string> = {
            'General': 'Gen',
            'Dashboard': 'Dash',
            'Settings': 'Set',
            'Analytics': 'Anl',
            'Transaction': 'Tx',
            'Customers': 'Cus',
            'Reports': 'Rpt',
            'Security': 'Sec',
            'Integrations': 'Int',
            'Support': 'Sup',
        };
        return labelMap[label] || label.slice(0, 3);
    };

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div>
            {sections.map((section) => {
                // Filter items by roles & permissions
                const filteredItems = section.items.filter((item) => {
                    // Jika tidak ada roles/permissions, tampilkan
                    const hasRoles = Array.isArray(item.roles) && item.roles.length > 0;
                    const hasPermissions = Array.isArray(item.permissions) && item.permissions.length > 0;
                    // Jika tidak ada roles & permissions, tampilkan
                    if (!hasRoles && !hasPermissions) return true;
                    // Jika ada roles/permissions, cek minimal salah satu
                    const userHasRole = hasRoles && item.roles ? item.roles.some((role) => hasRole(role)) : false;
                    const userHasPermission = hasPermissions && item.permissions ? item.permissions.some((perm) => hasPermission(perm)) : false;
                    // Tampilkan jika user punya salah satu
                    return userHasRole || userHasPermission;
                });
                if (filteredItems.length === 0) return null;
                return (
                    <div key={section.label} className="px-2 py-1">
                        <p
                            className={`
                    text-[9px] font-black uppercase text-slate-400
                    transition-all duration-200
                    h-6 flex items-center tracking-wider
                    ${collapsed ? 'justify-center px-0' : 'px-2'}
                  `}
                        >
                            {collapsed ? shortenLabel(section.label) : section.label}
                        </p>
                        <div className="mt-1 space-y-0.5 flex flex-col">
                            {filteredItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.url;
                                return (
                                    <Button
                                        key={item.text}
                                        variant="ghost"
                                        className={`
                                                        h-8 py-1.5 px-2 text-xs w-full justify-start overflow-hidden text-ellipsis whitespace-nowrap rounded font-bold group
                                                        ${isActive ? 'bg-gray-100' : ''}
                                                        ${isActive ? 'text-gray-900' : 'text-gray-300 hover:text-white hover:bg-white/5'}
                                                        ${collapsed ? 'flex justify-center px-0' : ''}
                                                    `}
                                        onClick={() => navigate(item.url)}
                                    >
                                        <Icon className={`${collapsed ? '' : 'mr-2'} h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                                        {!collapsed && (
                                            <span className="truncate group-hover:pl-1">{item.text}</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SidebarItem