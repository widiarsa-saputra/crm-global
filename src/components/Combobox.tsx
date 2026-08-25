import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { FloatingInput } from './FloatingInput';

export type ComboOptions<T> = { label: string, value: string, data?: T };

type Props<T> = Omit<React.ComponentProps<typeof FloatingInput>, 'watch' | 'inputProps'> & {
    value: string | null | undefined;
    onChange: (value: ComboOptions<T>) => void;
    externalSearch?: (search: string) => void;
    options: ComboOptions<T>[];
    inputProps?: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
    maxHeight?: string | number;
}

const Combobox = <T,>({ value, onChange, options, externalSearch, id, label, icon, error, required, rightSlot, inputProps, maxHeight = '300px' }: Props<T>) => {
    const [open, setOpen] = useState(false);
    const [onFocus, setOnFocus] = useState(false);
    const [itemFocus, setItemFocus] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<ComboOptions<T>[]>([]);

    const filteredOptionsValue = React.useMemo(() => options.filter(phase => phase.label.toLowerCase().includes(search?.toLowerCase() ?? '')), [options, search]);
    useEffect(() => {
        setFilteredOptions(filteredOptionsValue)
    }, [filteredOptionsValue])

    const hideContent = filteredOptions.length === 0;

    useEffect(() => {
        if (filteredOptions.length !== 0) {
            setItemFocus(prev => {
                if (prev && filteredOptions.some(opt => opt.value === prev)) {
                    return prev;
                }
                return filteredOptions[0].value;
            });
        } else {
            setItemFocus(null);
        }
    }, [filteredOptions])

    useEffect(() => {
        const isOpen = onFocus;
        setOpen(isOpen)
    }, [onFocus])

    const handleSelect = (val: ComboOptions<T>) => {
        onChange(val);
        setSearch('');
        setFilteredOptions(options);
        setOpen(false)
    }
    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (filteredOptions.length !== 0) {
                    const index = filteredOptions.findIndex(item => item.value === itemFocus);
                    setItemFocus(filteredOptions[index + 1] ? filteredOptions[index + 1].value : filteredOptions[0].value);
                    onChange(filteredOptions[index + 1] ? filteredOptions[index + 1] : filteredOptions[0])
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (filteredOptions.length !== 0) {
                    const index = filteredOptions.findIndex(item => item.value === itemFocus);
                    setItemFocus(filteredOptions[index - 1] ? filteredOptions[index - 1].value : filteredOptions[filteredOptions.length - 1].value);
                    onChange(filteredOptions[index - 1] ? filteredOptions[index - 1] : filteredOptions[filteredOptions.length - 1])
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions.length !== 0) {
                    handleSelect(filteredOptions.find(item => item.value === itemFocus) as ComboOptions<T>)
                }
                break;
            default:
                break;
        }
    }

    const showValue = options.find(option => option.value === value)?.label ?? value;

    return (
        <>
            <Popover open={open}>
                <PopoverTrigger asChild>
                    <div className="w-full">
                        <FloatingInput
                            id={id}
                            label={label}
                            icon={icon}
                            error={error}
                            required={required}
                            rightSlot={rightSlot}
                            watch={value ?? search ?? ''}
                            inputProps={{
                                ...inputProps,
                                value: showValue ?? '',
                                onChange: e => {
                                    const val = e.target.value;
                                    onChange({ label: val, value: val } as ComboOptions<T>);
                                    externalSearch?.(val);
                                    setSearch(val);
                                },
                                className: cn("w-full", inputProps?.className),
                                onFocus: (e) => {
                                    setOnFocus(true);
                                    inputProps?.onFocus?.(e);
                                },
                                onBlur: (e) => {
                                    setOnFocus(false);
                                    inputProps?.onBlur?.(e);
                                },
                                onKeyDown: (e) => {
                                    handleOnKeyDown(e);
                                    inputProps?.onKeyDown?.(e);
                                },
                            }}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    align="start"
                    className={cn(
                        "w-[var(--radix-popover-trigger-width)]",
                        hideContent ? 'hidden' : '!p-1'
                    )}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    sideOffset={-10}
                >
                    <div 
                        className="flex flex-col divide-y overflow-y-auto" 
                        style={{ maxHeight }}
                        onWheel={e => e.stopPropagation()}
                    >
                        {
                            filteredOptions.map(phase => (
                                <button
                                    className={cn(
                                        "px-2 py-1 text-left text-sm capitalize rounded",
                                        itemFocus === phase.value ? 'bg-primary/10' : 'hover:bg-primary/10'
                                    )}
                                    onClick={() => handleSelect(phase)}
                                    key={phase.value}
                                    tabIndex={-1}
                                    type="button"
                                >
                                    {phase.label}
                                </button>
                            ))
                        }
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default Combobox;

interface TimezoneComboboxProps {
    value?: string | null;
    onChange: (value: string) => void;
    id: string;
    label: string;
    error?: string;
    required?: boolean;
}

export const TimezoneCombobox = ({ value, onChange, id, label, error, required }: TimezoneComboboxProps) => {
    const timezones = React.useMemo(() => {
        try {
            return (Intl as unknown as { supportedValuesOf: (key: string) => string[] }).supportedValuesOf('timeZone');
        } catch (e) {
            console.error(e)
            return ['UTC', 'Asia/Jakarta'];
        }
    }, []);
    const options = React.useMemo(() => timezones.map((tz: string) => ({ label: tz.replace(/_/g, ' '), value: tz })), [timezones]);
    return (
        <Combobox
            id={id}
            label={label}
            options={options}
            value={value}
            onChange={(opt) => onChange(opt.value)}
            error={error}
            required={required}
        />
    )
}