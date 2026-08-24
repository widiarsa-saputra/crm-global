import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RadioItemListProps<T> = {
    data: T[];
    selectedKey: string;
    onChange: (key: string) => void;
    keySelector: (item: T) => string;
    labelSelector?: (item: T) => string;
    renderItem?: (
        item: T,
        options: {
            key: string;
            checked: boolean;
            onChange: () => void;
        }
    ) => React.ReactNode;
    className?: string;
    radioItemClassName?: string;
    labelClassName?: string;
};

export function RadioItemList<T>({
    data,
    selectedKey,
    onChange,
    keySelector,
    labelSelector = (item) => keySelector(item),
    renderItem,
    className,
    radioItemClassName = "w-5 h-5 rounded border cursor-pointer data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300 data-[state=unchecked]:text-gray-700 hover:data-[state=unchecked]:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    labelClassName = "text-sm",
}: RadioItemListProps<T>) {
    return (
        <RadioGroup
            value={selectedKey}
            onValueChange={(value) => onChange(value)}
            className={className}
        >
            {data.map((item) => {
                const key = keySelector(item);
                const checked = selectedKey === key;
                const handleChange = () => onChange(key);

                if (renderItem) {
                    return (
                        <div key={key}>
                            {renderItem(item, { key, checked, onChange: handleChange })}
                        </div>
                    );
                }

                // Default UI
                return (
                    <div key={key} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={key} id={key} className={radioItemClassName} />
                        <label htmlFor={key} className={labelClassName}>
                            {labelSelector(item)}
                        </label>
                    </div>
                );
            })}
        </RadioGroup>
    );
}
