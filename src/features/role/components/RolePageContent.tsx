import React, { useState } from 'react'
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput'
import { Download, List, Plus, Search } from 'lucide-react';
import FilterDropdown from '@/shared/components/utility/FilterDropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/shared/components/table/BaseTable';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import SortByDropdown from '@/shared/components/utility/SortByDropdown';
import { useIndexRole } from '@/services/role';
import AddRoleModal from './AddRoleModal';
import EditRoleModal from './EditRoleModal';
import RemoveRole from './RemoveRole';
import { useNavigate } from 'react-router';
import { getInitials, getRandomBgAndTextColor } from '@/lib/utils';

const RolePageContent: React.FC = () => {
    const [search, setSearch] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: roles, isFetching, isSuccess } = useIndexRole({
        params: {
            search: search,
            paginate: entriesPerPage,
            page: currentPage,
            include: "users",
        }
    });

    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);

    const handleApplyFilter = () => {
        console.log("Filter applied", { isActive, isInactive });
        // Aksi untuk menerapkan filter sesuai dengan status yang dipilih.
    };

    const handleClearFilter = () => {
        setIsActive(false);
        setIsInactive(false);
        console.log("Filters cleared");
        // Aksi untuk membersihkan filter.
    };

    const [isAscending, setIsAscending] = useState(true); // State untuk urutan (ascending/descending)

    const navigate = useNavigate();

    return (
        <main className="p-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
                {/* Left - Add Button */}
                <AddRoleModal />

                {/* Right - Search, Filter, Download */}
                <div className="flex items-center gap-2">
                    <DebouncedSearchInput
                        value={search}
                        onChange={setSearch}
                        debounceTime={400}
                        icon={<Search className="h-4 w-4" />}
                        className="my-4"
                        inputClassName="text-sm"
                        placeholder="Search here..."
                    />

                    {/* Filter Dropdown */}
                    <FilterDropdown onApply={handleApplyFilter} onClear={handleClearFilter}>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="flex items-center">
                                <Checkbox checked={isActive} onCheckedChange={() => setIsActive(!isActive)} />
                                <span className="ml-2">Active</span>
                            </label>

                            <label className="flex items-center">
                                <Checkbox checked={isInactive} onCheckedChange={() => setIsInactive(!isInactive)} />
                                <span className="ml-2">Inactive</span>
                            </label>
                        </div>
                    </FilterDropdown>

                    {/* Download Button */}
                    <Button className="bg-emerald-600 hover:bg-emerald-300 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <BaseTable
                columns={[
                    { title: "Name", key: "name" },
                    { title: "Display Name", key: "display_name" },
                    {
                        title: "User Assigned",
                        key: "user_assigned",
                        render: (item) => {
                            if (!item.users || item.users.length === 0) return (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="w-8 h-8 rounded ml-1 border-dashed"
                                    onClick={() => navigate(`/roles/${item.id}/users`)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            );

                            return (
                                <div className="flex items-center -space-x-2 cursor-pointer">
                                    {item.users.map((user, idx) => {
                                        const { bgColor } = getRandomBgAndTextColor();
                                        return (
                                            <div
                                                key={idx}
                                                className={`w-8 h-8 rounded ${bgColor} text-white flex items-center justify-center text-xs font-medium border-2 border-white`}
                                                onClick={() => navigate(`/roles/${item.id}/users`)}
                                            >
                                                {getInitials(user.name)}
                                            </div>
                                        )
                                    })}
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="w-8 h-8 rounded ml-1 border-dashed"
                                        onClick={() => navigate(`/roles/${item.id}/users`)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        }
                    },
                    {
                        title: "Actions",
                        key: "actions", // bebas, karena tidak diakses langsung dari item
                        render: (item) => (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                    onClick={() => navigate(`/roles/${item.id}/permissions`)}
                                    aria-label="View"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <EditRoleModal role={item} />
                                <RemoveRole role={item} />
                            </>
                        ),
                        className: "text-right",
                    },
                ]}
                data={Array.isArray(roles?.data) ? roles.data : []}
                isLoading={isFetching}
                renderHeader={() => (
                    <>
                        <h2 className="text-lg font-medium">Role List</h2>
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-2">
                                <SortByDropdown onSortChange={setIsAscending} isAscending={isAscending} />
                            </div>
                        </div>
                    </>
                )}
                skeletonRows={10}
            />
            {isSuccess && (
                <>
                    {/* Pagination */}
                    {roles.pagination && (
                        <PaginationWithShow
                            totalItems={roles.pagination.total}
                            itemsPerPage={entriesPerPage}
                            currentPage={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                            onItemsPerPageChange={(items) => setEntriesPerPage(items)}
                        />
                    )}
                </>
            )}
        </main>
    )
}

export default RolePageContent