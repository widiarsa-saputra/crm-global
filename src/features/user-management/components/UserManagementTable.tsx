import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IndexUserResponse } from '@/services/user';
import { SortAsc, SortDesc } from 'lucide-react';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import UserItems from './UserItems';

type Props = {
    users: IndexUserResponse;
}

const UserManagementTable: React.FC<Props> = ({ users }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded border">
            <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-medium">{t("user-management.table.title")}</h2>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <SortByDropdown />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("user-management.table.name")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("user-management.table.email")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("user-management.table.phone")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("user-management.table.role")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("user-management.table.action.title")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(users.data as any[]).map((user: any) => (
                            <UserItems user={user} key={user.id} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagementTable

const SortByDropdown = () => {
    const { t } = useTranslation();
    const [isAscending, setIsAscending] = useState(true); // State untuk urutan (ascending/descending)

    // Fungsi untuk toggle urutan
    const toggleSortOrder = () => {
        setIsAscending((prev) => !prev);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-700">{t("common.sort.title")}</span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2" onClick={toggleSortOrder}>
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
                    <DropdownMenuItem onClick={() => setIsAscending(true)}>
                        {t("common.sort.asc")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAscending(false)}>
                        {t("common.sort.desc")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};