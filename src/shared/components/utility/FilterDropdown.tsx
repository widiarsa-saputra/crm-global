import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import React from "react";

interface FilterDropdownProps {
    children: React.ReactNode;
    onApply?: () => void;
    onClear?: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ children, onApply, onClear }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 p-4">
                <div className="flex flex-col gap-2 mb-4">
                    {children}
                </div>

                <Button className="w-full bg-indigo-600 text-white" onClick={onApply}>
                    Apply Filter
                </Button>

                <Button className="w-full bg-gray-300 text-gray-700 mt-2" onClick={onClear}>
                    Clear
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FilterDropdown;
