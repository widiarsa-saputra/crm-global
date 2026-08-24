import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import React, { useState, useEffect } from "react";

interface DebouncedSearchInputProps {
    value?: string;
    onChange: (value: string) => void;
    debounceTime?: number; // ms
    className?: string;
    inputClassName?: string;
    icon?: React.ReactNode;
    placeholder?: string;
}

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
    value = "",
    onChange,
    debounceTime = 300,
    className = "",
    inputClassName = "",
    placeholder = "Search",
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
        <div className={cn("relative flex-grow max-w-md", className)}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                // placeholder="Cari nama negara, kode, atau continent..."
                placeholder={placeholder}
                className={cn(
                    "w-full h-9 pl-10 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400", inputClassName
                )}
            />
            {value.length > 0 && (
                <button onClick={() => setInputValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default DebouncedSearchInput;
