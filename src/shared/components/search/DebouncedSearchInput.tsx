import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FloatingInput } from "@/components/FloatingInput";

interface DebouncedSearchInputProps {
    value?: string;
    onChange: (value: string) => void;
    debounceTime?: number; // ms
    className?: string;
    inputClassName?: string;
    icon?: React.ElementType;
    placeholder?: string;
    label?: string;
}

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
    value = "",
    onChange,
    debounceTime = 300,
    className = "",
    inputClassName = "",
    placeholder = "Search",
    label = "Search",
    icon = Search,
}) => {
    const [inputValue, setInputValue] = useState(value);

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        }, debounceTime);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, debounceTime, onChange, value]);

    // Sync internal state if parent value changes externally
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div className={cn("relative max-w-md", className)}>
            <FloatingInput
                id="debounced-search"
                label={label}
                icon={icon}
                watch={inputValue}
                inputProps={{
                    type: "text",
                    value: inputValue,
                    onChange: (e) => setInputValue(e.target.value),
                    placeholder: placeholder,
                    className: inputClassName,
                }}
                rightSlot={
                    value.length > 0 && (
                        <button onClick={() => setInputValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    )
                }
            />
        </div>
    );
};

export default DebouncedSearchInput;
