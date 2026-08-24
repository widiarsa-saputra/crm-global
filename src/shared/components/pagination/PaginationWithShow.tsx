import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    maxButtonsToShow?: number; // Optional prop to limit the number of page buttons shown
}

const PaginationWithShow: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange, maxButtonsToShow }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        onItemsPerPageChange(newItemsPerPage);
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Logic untuk hanya menampilkan max 5 halaman
    const getVisiblePages = () => {
        const maxPagesToShow = maxButtonsToShow || 5; // Default to 5 if not provided
        const half = Math.floor(maxPagesToShow / 2);

        let start = Math.max(currentPage - half, 1);
        let end = start + maxPagesToShow - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - maxPagesToShow + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="flex flex-col p-4 gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Side - Show Selection */}
            <div className="order-2 lg:order-1 w-full flex justify-center lg:justify-start text-sm text-gray-700 items-center gap-2">
                <span>Show</span>
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2 py-1 border rounded-md text-sm"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                </select>
                <span>per page</span>
            </div>

            {/* Right Side - Pagination */}
            <Pagination className="order-1 lg:order-2 justify-center lg:justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={currentPage === 1 ? undefined : handlePrev}
                            className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>

                    {/* Page Number Links */}
                    {getVisiblePages().map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={() => onPageChange(page)}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}


                    {/* Ellipsis if there are more pages */}
                    {/* {totalPages > 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )} */}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={currentPage === totalPages ? undefined : handleNext}
                            className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationWithShow;
