import { MenuSection, ROUTES } from '@/router/AppRouter'
import {
    LayoutDashboard,
    Users,
    Mail,
    Send,
    FileText,
    Globe
} from 'lucide-react'
import React, { ElementType, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

interface Props {
    children?: React.ReactNode
}

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google: any;
    }
}

const AdminLayout: React.FC<Props> = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        if (!document.getElementById('google-translate-script')) {
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    { pageLanguage: 'en', includedLanguages: 'en,id', autoDisplay: false },
                    'google_translate_element'
                );
            };

            const addScript = document.createElement('script');
            addScript.id = 'google-translate-script';
            addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            addScript.async = true;
            document.body.appendChild(addScript);
        }
    }, []);

    const handleLanguageChange = (lang: string) => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
        }
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
                { icon: Send as ElementType, text: 'Campaign Logs', url: ROUTES.CAMPAIGN_CONTACTS.path },
                { icon: FileText as ElementType, text: 'Templates', url: ROUTES.TEMPLATES.path },
            ],
            icon: Mail as ElementType,
            order: 3
        },
    ];

    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-50">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm px-4">
                <div className="flex h-16 items-center justify-between px-10 mx-auto w-full">
                    <div className="flex items-center">
                        <div className="mr-8 flex items-center">
                            <div className="bg-primary text-white p-2 rounded-md font-black mr-2">CG</div>
                            <h1 className="text-xl font-bold text-primary hidden md:block">CRM Global</h1>
                        </div>
                        
                        <nav className="flex items-center space-x-1 md:space-x-6 overflow-x-auto no-scrollbar">
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

                    <div className="flex items-center ml-4">
                        <div id="google_translate_element" style={{ display: 'none' }}></div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Globe className="h-4 w-4" />
                                    <span className="sr-only">Toggle language</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer">
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleLanguageChange('id')} className="cursor-pointer">
                                    Indonesia
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Optional TopBar for actions (search, filter, etc) */}
            {/* <div className="border-b bg-white/50">
                <TopBar />
            </div> */}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col w-full mx-auto bg-gray-50/50">
                <div className="flex-1 w-full flex flex-col overflow-x-hidden px-10">
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
