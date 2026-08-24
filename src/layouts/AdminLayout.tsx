import { MenuSection, ROUTES } from '@/router/AppRouter'
import {
    LayoutDashboard,
    Users,
    Mail,
    Send,
    FileText
} from 'lucide-react'
import React, { ElementType } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'

interface Props {
    children?: React.ReactNode
}

const AdminLayout: React.FC<Props> = ({ children }) => {
    const location = useLocation();
    
    const menuSections: MenuSection[] = [
        {
            label: 'Utama',
            items: [
                { icon: LayoutDashboard as ElementType, text: 'Dashboard', url: ROUTES.SLASH.path },
            ],
            icon: LayoutDashboard as ElementType,
            order: 1
        },
        {
            label: 'CRM & Audiences',
            items: [
                { icon: Users as ElementType, text: 'Contacts & Segments', url: ROUTES.CONTACTS.path },
            ],
            icon: Users as ElementType,
            order: 2
        },
        {
            label: 'Email Campaigns',
            items: [
                { icon: Mail as ElementType, text: 'Campaigns', url: ROUTES.CAMPAIGNS.path },
                { icon: Send as ElementType, text: 'Campaign Contacts', url: ROUTES.CAMPAIGN_CONTACTS.path },
                { icon: FileText as ElementType, text: 'Templates', url: ROUTES.TEMPLATES.path },
            ],
            icon: Mail as ElementType,
            order: 3
        },
    ];

    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-50">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
                <div className="flex h-16 items-center px-6 max-w-7xl mx-auto w-full">
                    <div className="mr-8 flex items-center">
                        <div className="bg-primary text-white p-2 rounded-md font-black mr-2">CG</div>
                        <h1 className="text-xl font-bold text-primary hidden md:block">CRM Global</h1>
                    </div>
                    
                    <nav className="flex items-center space-x-1 md:space-x-6 flex-1 overflow-x-auto no-scrollbar">
                        {menuSections.map((section) => (
                            section.items.map((item, idx) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.url || (item.url !== ROUTES.SLASH.path && location.pathname.startsWith(item.url + '/'));
                                return (
                                    <Link 
                                        key={`${section.label}-${idx}`} 
                                        to={item.url}
                                        className={cn(
                                            "flex items-center text-sm font-medium transition-colors hover:text-primary whitespace-nowrap px-3",
                                            isActive ? "text-primary border-b-2 border-primary py-5" : "text-muted-foreground py-5 border-b-2 border-transparent"
                                        )}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.text}
                                    </Link>
                                );
                            })
                        ))}
                    </nav>
                </div>
            </header>

            {/* Optional TopBar for actions (search, filter, etc) */}
            {/* <div className="border-b bg-white/50">
                <TopBar />
            </div> */}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto bg-gray-50/50">
                <div className="flex-1 w-full flex flex-col overflow-x-hidden">
                    {children}
                </div>
            </main>

            {/* Dummy Footer */}
            <footer className="border-t bg-white py-6 mt-auto">
                <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} CRM Global Inc. All rights reserved.</p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AdminLayout
