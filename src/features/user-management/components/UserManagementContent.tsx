import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DashboardCard } from '@/shared/components/card/DashboardCard';
import { Download, Filter, Loader2, Search, UserRoundCheck, UserRoundPlus, UserRoundX, Users } from 'lucide-react';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import UserManagementTable from './UserManagementTable';
import { Checkbox } from '@/components/ui/checkbox';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import useIndexUser from '@/services/user';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';
import SectionLoader from '@/shared/components/loader/SectionLoader';
import AddUserModal from './AddUserModal';
import ImportUserModal from './ImportUserModal';
import useExportUsers from '@/services/user';
import useDownloadImportTemplate from '@/services/user';
import { toast } from 'sonner';

const UserManagementContent: React.FC = () => {
    const { t } = useTranslation();
    const exportUsers = useExportUsers();
    const downloadTemplate = useDownloadImportTemplate();

    const handleDownloadTemplate = async () => {
        try {
            await downloadTemplate.mutateAsync();
            toast("Download Success", {
                description: "Template impor user berhasil diunduh.",
            });
        } catch {
            toast.error("Download Failed", {
                description: "Gagal mengunduh template impor.",
            });
        }
    };

    const handleExport = async () => {
        try {
            await exportUsers.mutateAsync();
            toast("Export Success", {
                description: "Seluruh data pengguna berhasil diekspor ke file Excel.",
            });
        } catch {
            toast.error("Export Failed", {
                description: "Terjadi kesalahan saat memproses ekspor data.",
            });
        }
    };
    const dashboardCards = [
        {
            title: t("user-management.card.total-users"),
            icon: <Users className="h-4 w-4" />,
            iconBg: "bg-slate-50 text-slate-400",
            value: "0",
            changeType: "up" as const,
        },
        {
            title: t("user-management.card.active-users"),
            icon: <UserRoundCheck className="h-4 w-4" />,
            iconBg: "bg-emerald-50 text-emerald-500",
            value: "0",
            changeType: "up" as const,
        },
        {
            title: t("user-management.card.inactive-users"),
            icon: <UserRoundX className="h-4 w-4" />,
            iconBg: "bg-red-50 text-red-500",
            value: "0",
            changeType: "down" as const,
        },
        {
            title: t("user-management.card.recently-added"),
            icon: <UserRoundPlus className="h-4 w-4" />,
            iconBg: "bg-blue-50 text-blue-500",
            value: "0",
            changeType: "up" as const,
        },
    ]

    const [search, setSearch] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: users, isFetching, isSuccess, refetch } = useIndexUser({
        params: {
            search: search,
            paginate: entriesPerPage,
            page: currentPage,
            include: "roles,permissions"
        }
    });

    return (
        <main className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-black uppercase text-slate-900 tracking-tight">Manajemen User</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kelola akun dan hak akses personil</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {dashboardCards.map((card, idx) => (
                    <DashboardCard
                        key={idx}
                        {...card}
                        onDetailClick={() => console.log(`Detail clicked: ${card.title}`)}
                    />
                ))}
            </div>

            {/* Action Bar */}
            <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-3 flex flex-col md:flex-row items-center justify-between gap-3 bg-white/50">
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <AddUserModal />
                        <ImportUserModal onSuccess={() => refetch()} />
                        
                        <div className="w-full sm:w-64">
                            <DebouncedSearchInput
                                value={search}
                                onChange={setSearch}
                                debounceTime={400}
                                icon={<Search className="h-3.5 w-3.5" />}
                                placeholder="Cari User..."
                                inputClassName="bg-slate-50/80 border-slate-100 h-9 rounded"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Filter Dropdown */}
                        <FilterDropdown />

                        {/* Download Template Button */}
                        <Button 
                            variant="outline" 
                            onClick={handleDownloadTemplate}
                            disabled={downloadTemplate.isPending}
                            className="h-9 gap-2 border-slate-200 text-slate-500 italic"
                        >
                            {downloadTemplate.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            <span className="hidden lg:inline">Import Template</span>
                        </Button>

                        {/* Download Button */}
                        <Button 
                            variant="outline" 
                            onClick={handleExport}
                            disabled={exportUsers.isPending}
                            className="h-9 gap-2 border-slate-200"
                        >
                            {exportUsers.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            <span className="hidden sm:inline">Export User</span>
                        </Button>
                    </div>
                </div>

                {isFetching ? (
                    <div className="h-64 flex items-center justify-center bg-slate-50/30">
                        <SectionLoader text="Loading users..." time={1200} className="bg-transparent" />
                    </div>
                ) : isSuccess && (
                    <div className="border-t border-slate-100">
                        <UserManagementTable users={users} />
                        {users.pagination && (
                            <div className="p-3 border-t border-slate-50 bg-slate-50/30">
                                <PaginationWithShow
                                    totalItems={users.pagination.total}
                                    itemsPerPage={entriesPerPage}
                                    currentPage={currentPage}
                                    onPageChange={(page) => setCurrentPage(page)}
                                    onItemsPerPageChange={(items) => setEntriesPerPage(items)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}

export default UserManagementContent

const FilterDropdown = () => {
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);

    const handleApplyFilter = () => {
        console.log("Filter applied", { isActive, isInactive });
    };

    const handleClearFilter = () => {
        setIsActive(false);
        setIsInactive(false);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-9 px-3 border-slate-200">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Filter</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 p-0 rounded border-slate-200 shadow-xl" align="end">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filter Status</p>
                </div>
                <div className="p-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox checked={isActive} onCheckedChange={() => setIsActive(!isActive)} className="rounded border-slate-300 data-[state=checked]:bg-falala-navy" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase group-hover:text-falala-navy">Active Users</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox checked={isInactive} onCheckedChange={() => setIsInactive(!isInactive)} className="rounded border-slate-300 data-[state=checked]:bg-falala-navy" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase group-hover:text-falala-navy">Inactive Users</span>
                    </label>
                </div>

                <div className="p-2 bg-slate-50 flex gap-2 border-t border-slate-100">
                    <Button
                        className="flex-1 h-8 bg-falala-navy"
                        onClick={handleApplyFilter}
                    >
                        Apply
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 border-slate-200"
                        onClick={handleClearFilter}
                    >
                        Clear
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};