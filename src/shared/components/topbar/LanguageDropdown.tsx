// src/components/LanguageDropdown.tsx

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages, Check } from 'lucide-react'; // Ganti import ikon
import i18n from '@/i18n';

const LanguageDropdown: React.FC = () => {
    // Logika ini sudah bagus dan tidak perlu diubah
    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* PERUBAHAN 1: Tombol sekarang hanya ikon */}
                <Button variant="outline" size="icon" className="gap-2">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded p-2 shadow-2xl">
                <DropdownMenuLabel>Pilih Bahasa / Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* PERUBAHAN 2: Tambahkan indikator centang untuk bahasa aktif */}
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer rounded px-4 py-2 text-xs font-bold uppercase">
                    English
                    {i18n.language === 'en' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleLanguageChange('id')} className="cursor-pointer rounded px-4 py-2 text-xs font-bold uppercase">
                    Bahasa Indonesia
                    {i18n.language === 'id' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageDropdown;