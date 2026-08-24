import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SortAsc, SortDesc } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    onSortChange: (isAscending: boolean) => void; // Callback untuk mengubah urutan
    isAscending: boolean; // State untuk urutan (ascending/descending)
}

const SortByDropdown: React.FC<Props> = ({ onSortChange, isAscending }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-700">{t("common.sort.title")}</span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => onSortChange(!isAscending)}>
                        {/* Tampilkan ikon sesuai urutan */}
                        {isAscending ? (
                            <SortAsc className="h-4 w-4 cursor-pointer" />
                        ) : (
                            <SortDesc className="h-4 w-4 cursor-pointer" />
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    {/* Menambahkan pilihan Ascending dan Descending */}
                    <DropdownMenuItem onClick={() => onSortChange(true)}>
                        {t("common.sort.asc")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSortChange(false)}>
                        {t("common.sort.desc")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default SortByDropdown;