import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { formatNumber } from "./InputCurrency";

export type FloatingSharedProps<T> = {
    id: string;
    label: string;
    icon?: React.ElementType;
    error?: string;
    watch?: string;
    rightSlot?: React.ReactNode;
    required?: boolean;
    inputProps?: T;
};

export const FloatingInput = ({
    id,
    type = 'text',
    label,
    icon: Icon,
    error,
    watch,
    rightSlot,
    inputProps,
    required
}: FloatingSharedProps<React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }> & { type?: string }) => {
    const [focused, setFocused] = useState(false)
    const isFloating = focused || !!watch;
    const { placeholder, ...restInputProps } = inputProps ?? {};

    return (
        <div className="space-y-2">
            <div className={`relative group/${id}`}>
                <Input
                    id={id}
                    type={type}
                    {...restInputProps}
                    placeholder={isFloating ? placeholder ?? undefined : undefined}
                    className={cn(
                        "h-11 rounded tracking-wide bg-slate-50/30 focus:bg-white",
                        Icon ? "pl-10 pr-10" : "px-3",
                        restInputProps?.className
                    )}
                    onFocus={(e) => {
                        setFocused(true);
                        restInputProps?.onFocus?.(e);
                    }}
                    onBlur={async (e) => {
                        setTimeout(() => setFocused(false), 300);
                        await restInputProps?.onBlur?.(e);
                    }}
                    required={required}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                    <Label
                        htmlFor={id}
                        className={cn(
                            `absolute whitespace-nowrap top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1`,
                            `bg-white px-2 duration-500 transition-all`,
                            Icon ? "left-8" : "left-2",
                            isFloating
                                ? Icon ? '!left-4 !top-0 !text-[10px] bg-white'
                                    : '!top-0 !text-[10px] !left-0 bg-white'
                                : ''
                        )}
                    >
                        {label} {required && <span className="text-red-500/50">*</span>}
                    </Label>
                </div>
                {rightSlot}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">{error}</p>}
        </div>
    )
};

export const FloatingTextArea = ({
    id,
    label,
    icon: Icon,
    error,
    watch,
    rightSlot,
    inputProps,
    required
}: FloatingSharedProps<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> }>) => {
    const [focused, setFocused] = useState(false)
    const isFloating = focused || !!watch;

    return (
        <div className="space-y-2">
            <div className={`relative group/${id}`}>
                <Textarea
                    id={id}
                    {...inputProps}
                    className={cn(
                        "flex min-h-[80px] w-full pt-4 pb-2 rounded border bg-slate-50/30 focus:bg-white text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        Icon ? "pl-10 pr-10" : "px-3",
                        inputProps?.className
                    )}
                    onFocus={(e) => {
                        setFocused(true);
                        inputProps?.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        inputProps?.onBlur?.(e);
                    }}
                    required={required}
                />
                <div className="absolute top-4 left-0 pl-3 flex items-center pointer-events-none">
                    {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                    <Label
                        htmlFor={id}
                        className={cn(
                            `absolute whitespace-nowrap top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1`,
                            `bg-white px-2 duration-500 transition-all`,
                            Icon ? "left-8" : "left-2",
                            // isFloating ? '!-top-4 !text-[10px] !left-4' : '',
                            isFloating
                                ? Icon ? '!left-4 !-top-4 !text-[10px]'
                                    : '!-top-4 !text-[10px] !left-0'
                                : ''
                        )}
                    >
                        {label} {required && <span className="text-red-500/50">*</span>}
                    </Label>
                </div>
                {rightSlot}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">{error}</p>}
        </div>
    )
};

export const FloatingCurrencyInput = ({
    id,
    label,
    icon: Icon,
    error,
    watch,
    rightSlot,
    value,
    onChange,
    prefix = "Rp ",
    inputProps,
    required
}: FloatingSharedProps<Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & { ref?: React.Ref<HTMLInputElement> }> & {
    value: number | null;
    onChange: (value: number | null) => void;
    prefix?: string;
}) => {
    const [focused, setFocused] = useState(false);
    const isFloating = focused || !!watch || (value !== null && value !== undefined && value.toString() !== '');
    const localRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (element: HTMLInputElement | null) => {
        localRef.current = element;
        if (typeof inputProps?.ref === 'function') {
            inputProps.ref(element);
        } else if (inputProps?.ref) {
            (inputProps.ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.target;
        const rawInputValue = inputEl.value;
        const currentCursorPos = inputEl.selectionStart || 0;

        let digitsBeforeCursor = 0;
        for (let i = 0; i < currentCursorPos; i++) {
            if (/\d/.test(rawInputValue[i])) {
                digitsBeforeCursor++;
            }
        }

        const cleanDigits = rawInputValue.replace(/\D/g, '');
        if (!cleanDigits) {
            onChange(null);
            return;
        }

        const numericValue = parseInt(cleanDigits, 10);
        const newFormatted = new Intl.NumberFormat('id-ID').format(numericValue);

        let newCursorPos = 0;
        let digitsCounted = 0;
        for (let i = 0; i < newFormatted.length; i++) {
            if (/\d/.test(newFormatted[i])) {
                digitsCounted++;
            }
            if (digitsCounted === digitsBeforeCursor) {
                newCursorPos = i + 1;
                break;
            }
        }

        if (digitsBeforeCursor === 0) newCursorPos = 0;

        onChange(numericValue);

        requestAnimationFrame(() => {
            if (localRef.current) {
                localRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    return (
        <div className="space-y-2">
            <div className={`relative group/${id}`}>
                {prefix && (
                    <span
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium pointer-events-none transition-all duration-300",
                            Icon ? "left-10" : "left-3",
                            isFloating ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {prefix}
                    </span>
                )}
                <Input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    {...inputProps}
                    ref={setRefs}
                    className={cn(
                        "h-11 rounded tracking-wide bg-slate-50/30 focus:bg-white",
                        Icon && prefix ? "pl-16 pr-10" : (Icon || prefix) ? "pl-10 pr-10" : "px-3",
                        inputProps?.className
                    )}
                    value={formatNumber(value)}
                    onChange={handleChange}
                    onFocus={(e) => {
                        setFocused(true);
                        inputProps?.onFocus?.(e);
                    }}
                    onBlur={async (e) => {
                        setTimeout(() => setFocused(false), 300);
                        if (inputProps?.onBlur) {
                            await inputProps.onBlur(e);
                        }
                    }}
                    required={required}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                    <Label
                        htmlFor={id}
                        className={cn(
                            `absolute whitespace-nowrap top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1`,
                            `bg-white px-2 duration-500 transition-all`,
                            Icon ? "left-8" : "left-2",
                            // isFloating ? '!top-0 !text-[10px] !left-4' : '',
                            isFloating
                                ? Icon ? '!left-4 !top-0 !text-[10px]'
                                    : '!top-0 !text-[10px] !left-0'
                                : ''
                        )}
                    >
                        {label} {required && <span className="text-red-500/50">*</span>}
                    </Label>
                </div>
                {rightSlot}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">{error}</p>}
        </div>
    )
};

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DAYS_IN_MONTH = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

type ParsedInput = {
    day: number | null;
    monthQuery: string;
    year: string;
};

/** Parse "12 d", "12 des", "12 desember 2026", dst */
function parseInput(raw: string): ParsedInput {
    const match = raw.trim().match(/^(\d{1,2})?\s*([a-zA-Z]*)\s*(\d{1,4})?$/);
    if (!match) return { day: null, monthQuery: "", year: "" };
    const [, day, monthQuery = "", year = ""] = match;
    return {
        day: day ? parseInt(day, 10) : null,
        monthQuery: monthQuery.toLowerCase(),
        year,
    };
}

type DateMatch = {
    day: number;
    monthIndex: number;
    monthName: string;
    year: number;
    label: string; // "12 Desember 2026"
};

function buildMatches(parsed: ParsedInput, currentYear: number): DateMatch[] {
    const { day, monthQuery, year } = parsed;
    if (day === null || day < 1 || day > 31) return [];

    const monthCandidates = monthQuery
        ? MONTHS.map((m, i) => ({ name: m, index: i })).filter(({ name }) =>
              name.toLowerCase().startsWith(monthQuery)
          )
        : MONTHS.map((m, i) => ({ name: m, index: i }));

    // Kalau user belum mulai ketik bulan sama sekali, jangan tampilkan semua 12 opsi
    if (!monthQuery) return [];

    const resolvedYear = year ? parseInt(year, 10) : currentYear;

    return monthCandidates
        .filter(({ index }) => day <= DAYS_IN_MONTH(index, resolvedYear))
        .map(({ name, index }) => ({
            day,
            monthIndex: index,
            monthName: name,
            year: resolvedYear,
            label: `${day} ${name} ${resolvedYear}`,
        }));
}

function formatDate(date: Date | null, currentYear: number) {
    if (!date) return "";
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}${year !== currentYear ? ` ${year}` : ` ${year}`}`;
}

export const FloatingDateInput = ({
    id,
    label,
    icon: Icon,
    error,
    rightSlot,
    inputProps,
    required,
    value,
    onChange,
    placeholder = "cth. 12 Desember 2026",
}: FloatingSharedProps<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">
> & {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
}) => {
    const currentYear = new Date().getFullYear();
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(() => formatDate(value, currentYear));
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Sinkronkan kalau value berubah dari luar (mis. reset form)
    useEffect(() => {
        if (!focused) {
            setInputValue(formatDate(value, currentYear));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const parsed = useMemo(() => parseInput(inputValue), [inputValue]);
    const matches = useMemo(() => buildMatches(parsed, currentYear), [parsed, currentYear]);
    const bestMatch = matches[Math.min(activeIndex, matches.length - 1)] ?? null;

    // Ghost suggestion: sisa teks yang belum diketik user, ditampilkan abu-abu
    const ghostRemainder = useMemo(() => {
        if (!bestMatch) return "";
        if (!bestMatch.label.toLowerCase().startsWith(inputValue.trim().toLowerCase())) {
            // Beda posisi spasi antara input mentah & label yang sudah dirapikan,
            // tetap tampilkan whole suggestion setelah bagian yang match secara kasar.
            return bestMatch.label.slice(inputValue.length);
        }
        return bestMatch.label.slice(inputValue.length);
    }, [bestMatch, inputValue]);

    const showDropdown = focused && matches.length > 0;

    const commitMatch = (m: DateMatch) => {
        const date = new Date(m.year, m.monthIndex, m.day);
        onChange(date);
        setInputValue(m.label);
        setActiveIndex(0);
        setFocused(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (matches.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => (i + 1) % matches.length);
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
                return;
            }
            if (e.key === "Tab" || e.key === "ArrowRight") {
                // Terima ghost text tanpa langsung submit, biar user masih bisa koreksi
                const el = inputRef.current;
                const atEnd = el ? el.selectionStart === inputValue.length : true;
                if (e.key === "ArrowRight" && !atEnd) return; // biar cursor normal jalan dulu
                e.preventDefault();
                setInputValue(bestMatch!.label);
                return;
            }
            if (e.key === "Enter") {
                e.preventDefault();
                commitMatch(bestMatch!);
                return;
            }
            if (e.key === "Escape") {
                setFocused(false);
                inputRef.current?.blur();
                return;
            }
        }
    };

    const isFloating = focused || !!inputValue;

    return (
        <div className="space-y-2" ref={containerRef}>
            <div className={`relative group/${id}`}>
                {/* Ghost text overlay: invisible span menjaga posisi, sisanya abu-abu */}
                <div
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute inset-y-0 flex items-center whitespace-pre text-sm tracking-wide",
                        Icon ? "left-10" : "left-3"
                    )}
                >
                    <span className="invisible">{inputValue}</span>
                    <span className="text-slate-400">{ghostRemainder}</span>
                </div>

                <Input
                    id={id}
                    type="text"
                    autoComplete="off"
                    {...inputProps}
                    ref={inputRef}
                    value={inputValue}
                    placeholder={focused ? placeholder : undefined}
                    className={cn(
                        "h-11 rounded tracking-wide bg-slate-50/30 focus:bg-white relative",
                        Icon ? "pl-10 pr-10" : "px-3",
                        inputProps?.className
                    )}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setActiveIndex(0);
                        if (e.target.value.trim() === "") onChange(null);
                    }}
                    onFocus={(e) => {
                        setFocused(true);
                        inputProps?.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        // delay biar klik di dropdown sempat kedaftar
                        setTimeout(() => {
                            setFocused(false);
                            // kalau user ninggalin input dengan ghost text yg valid, auto-commit
                            if (bestMatch && inputValue.trim() !== "") {
                                commitMatch(bestMatch);
                            } else if (!bestMatch) {
                                setInputValue(formatDate(value, currentYear));
                            }
                        }, 150);
                        inputProps?.onBlur?.(e);
                    }}
                    onKeyDown={handleKeyDown}
                    required={required}
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                    <Label
                        htmlFor={id}
                        className={cn(
                            `absolute whitespace-nowrap top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1`,
                            `bg-white px-2 duration-500 transition-all`,
                            Icon ? "left-8" : "left-2",
                            isFloating
                                ? Icon
                                    ? "!left-4 !top-0 !text-[10px]"
                                    : "!top-0 !text-[10px] !left-0"
                                : ""
                        )}
                    >
                        {label} {required && <span className="text-red-500/50">*</span>}
                    </Label>
                </div>
                {rightSlot}

                {showDropdown && (
                    <div className="absolute z-20 mt-1 w-full rounded border bg-white shadow-lg overflow-hidden">
                        {matches.map((m, i) => (
                            <button
                                type="button"
                                key={m.label}
                                // onMouseDown supaya jalan sebelum onBlur dari input
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    commitMatch(m);
                                }}
                                onMouseEnter={() => setActiveIndex(i)}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm tracking-wide",
                                    i === activeIndex ? "bg-slate-100" : "bg-white"
                                )}
                            >
                                {m.day} <span className="font-semibold">{m.monthName}</span> {m.year}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">{error}</p>}
        </div>
    );
};