// components/CheckboxAllToggle.tsx
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

type Props = {
    allSelected: boolean;
    toggleAll: () => void;
    label?: string;
    labelClassName?: string;
    toggleAllClassName?: string;
    renderToggle?: (props: {
        checked: boolean;
        onChange: () => void;
        label: string;
    }) => React.ReactNode;
};

export const CheckboxAllToggle: React.FC<Props> = ({
    allSelected,
    toggleAll,
    label = "Select All",
    labelClassName = "text-sm font-medium leading-none",
    toggleAllClassName = "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500 data-[state=unchecked]:border-gray-300 data-[state=unchecked]:bg-white data-[state=unchecked]:text-gray-700",
    renderToggle,
}) => {
    if (renderToggle) {
        return renderToggle({ checked: allSelected, onChange: toggleAll, label });
    }

    // Default UI
    return (
        <div className="flex items-center space-x-2">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} id="select-all" className={toggleAllClassName} />
            <label htmlFor="select-all" className={labelClassName}>
                {label}
            </label>
        </div>
    );
};
