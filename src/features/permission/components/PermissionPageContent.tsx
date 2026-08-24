import React, { useState } from 'react'
import AddPermissionModal from './AddPermissionModal'
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput'
import useIndexPermission from '@/services/permission/hooks/useIndexPermission';
import { Download, Search } from 'lucide-react';
import FilterDropdown from '@/shared/components/utility/FilterDropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { BaseTable, useColumnToggle } from '@/shared/components/table/BaseTable';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import SortByDropdown from '@/shared/components/utility/SortByDropdown';
import EditPermissionModal from './EditPermissionModal';
import RemovePermission from './RemovePermission';

const PermissionPageContent: React.FC = () => {
    const [search, setSearch] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: permissions, isFetching, isSuccess } = useIndexPermission({
        params: {
            search: search,
            paginate: entriesPerPage,
            page: currentPage
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

    // Column definitions
    const columns = [
        { title: "Name", key: "name" },
        { title: "Display Name", key: "display_name" },
        { title: "group", key: "group" },
        {
            title: "Actions",
            key: "actions",
            render: (item: any) => (
                <>
                    <EditPermissionModal permission={item} />
                    <RemovePermission permission={item} />
                </>
            ),
            className: "text-right",
        },
    ];

    // Hook untuk column toggle
    const { filteredColumns, renderColumnToggle } = useColumnToggle(columns);

    return (
        <main className="p-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
                {/* Left - Add Button */}
                <AddPermissionModal />

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
                columns={filteredColumns}
                data={permissions?.data || []}
                isLoading={isFetching}
                renderHeader={() => (
                    <>
                        <h2 className="text-lg font-medium">Permission List</h2>
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-2">
                                <SortByDropdown onSortChange={setIsAscending} isAscending={isAscending} />
                            </div>
                            {/* Tombol show/hide column diintegrasikan ke header */}
                            {renderColumnToggle()}
                        </div>
                    </>
                )}
                skeletonRows={10}
            />
            {isSuccess && (
                <>
                    {/* Pagination */}
                    {permissions.pagination && (
                        <PaginationWithShow
                            totalItems={permissions.pagination.total}
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

export default PermissionPageContent