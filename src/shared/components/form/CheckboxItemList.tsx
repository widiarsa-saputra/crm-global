// components/CheckboxItemList.tsx

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

type CheckboxItemListProps<T> = {
    data: T[];
    selectedKeys: string[];
    toggleItem: (key: string) => void;
    keySelector: (item: T) => string;
    labelSelector?: (item: T) => string;
    isSelected?: (key: string, item: T) => boolean;
    renderItem?: (
        item: T,
        options: {
            key: string;
            checked: boolean;
            toggle: () => void;
        }
    ) => React.ReactNode;
    className?: string;
    labelClassName?: string;
    toggleAllClassName?: string;
};

export function CheckboxItemList<T>({
    data,
    selectedKeys,
    toggleItem,
    keySelector,
    labelSelector,
    isSelected,
    renderItem,
    className,
    labelClassName = "text-sm",
    toggleAllClassName = "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500 data-[state=unchecked]:border-gray-300 data-[state=unchecked]:bg-white data-[state=unchecked]:text-gray-700",
}: CheckboxItemListProps<T>) {
    return (
        <div className={className}>
            {data.map((item) => {
                const key = keySelector(item);
                const checked = isSelected
                    ? isSelected(key, item)
                    : selectedKeys.includes(key);
                const toggle = () => toggleItem(key);

                if (renderItem) {
                    return (
                        <div key={key}>
                            {renderItem(item, { key, checked, toggle })}
                        </div>
                    );
                }

                // default fallback rendering
                return (
                    <div key={key} className="flex items-center gap-2 mb-2">
                        <Checkbox
                            id={`checkbox-${key}`}
                            checked={checked}
                            onCheckedChange={toggle}
                            className={toggleAllClassName}
                        />
                        <label htmlFor={`checkbox-${key}`} className={labelClassName}>
                            {labelSelector ? labelSelector(item) : key}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}
