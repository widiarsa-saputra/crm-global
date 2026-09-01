import React, { useRef, useState } from 'react';
import MDEditor, { type RefMDEditor } from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';

export interface InputRichTextProps {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

/** Curated button colour palette (label → hex). */
const BUTTON_COLORS = [
    { label: 'Primary', hex: '#6366f1' },   // indigo-500  ← default
    { label: 'Violet', hex: '#7c3aed' },
    { label: 'Sky', hex: '#0ea5e9' },
    { label: 'Teal', hex: '#14b8a6' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Rose', hex: '#f43f5e' },
    { label: 'Slate', hex: '#475569' },
];

/** Small helper that checks whether a hex colour is "dark" enough to need white text. */
function needsWhiteText(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Perceived luminance (W3C formula)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
}

/**
 * InsertButtonPopover — renders the trigger + popover that lets the user
 * compose an `<a>` styled as a button and injects it into the editor.
 */
function InsertButtonPopover({
    onInsert,
    disabled,
}: {
    onInsert: (html: string) => void;
    disabled: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [btnText, setBtnText] = useState('');
    const [btnUrl, setBtnUrl] = useState('');
    const [btnColor, setBtnColor] = useState(BUTTON_COLORS[0].hex);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside the popover
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleInsert = () => {
        if (!btnText.trim()) return;
        const textColor = needsWhiteText(btnColor) ? '#ffffff' : '#1e293b';
        const style = [
            `display:inline-block`,
            `padding:8px 20px`,
            `background-color:${btnColor}`,
            `color:${textColor}`,
            `border-radius:6px`,
            `text-decoration:none`,
            `font-weight:600`,
            `font-size:14px`,
        ].join(';');
        const html = `<a href="${btnUrl || '#'}" style="${style}">${btnText}</a>`;
        onInsert(html);
        // Reset
        setBtnText('');
        setBtnUrl('');
        setBtnColor(BUTTON_COLORS[0].hex);
        setOpen(false);
    };

    return (
        <div className="relative" ref={popoverRef}>
            {/* Trigger button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold',
                    'bg-indigo-50 text-indigo-700 border border-indigo-200',
                    'hover:bg-indigo-100 active:scale-95 transition-all duration-150',
                    'dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
                    'disabled:opacity-50 disabled:pointer-events-none',
                )}
            >
                {/* Link/button icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="8" width="18" height="8" rx="4" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                </svg>
                Insert Button
            </button>

            {/* Popover panel */}
            {open && (
                <div
                    className={cn(
                        'absolute right-0 z-50 mt-2 w-72 rounded-xl shadow-2xl',
                        'bg-white dark:bg-slate-900',
                        'border border-slate-200 dark:border-slate-700',
                        'p-4 space-y-3',
                    )}
                >
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Insert Button
                    </p>

                    {/* Button text */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Button Text <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={btnText}
                            onChange={(e) => setBtnText(e.target.value)}
                            placeholder="e.g. Visit Website"
                            className={cn(
                                'w-full rounded-lg border px-3 py-1.5 text-sm outline-none',
                                'border-slate-200 dark:border-slate-700',
                                'bg-slate-50 dark:bg-slate-800',
                                'text-slate-800 dark:text-slate-200',
                                'placeholder:text-slate-400',
                                'focus:ring-2 focus:ring-indigo-400/50',
                            )}
                        />
                    </div>

                    {/* Button URL */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            URL
                        </label>
                        <input
                            type="url"
                            value={btnUrl}
                            onChange={(e) => setBtnUrl(e.target.value)}
                            placeholder="https://example.com"
                            className={cn(
                                'w-full rounded-lg border px-3 py-1.5 text-sm outline-none',
                                'border-slate-200 dark:border-slate-700',
                                'bg-slate-50 dark:bg-slate-800',
                                'text-slate-800 dark:text-slate-200',
                                'placeholder:text-slate-400',
                                'focus:ring-2 focus:ring-indigo-400/50',
                            )}
                        />
                    </div>

                    {/* Colour palette */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Background Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {BUTTON_COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    type="button"
                                    title={c.label}
                                    onClick={() => setBtnColor(c.hex)}
                                    className={cn(
                                        'h-6 w-6 rounded-full border-2 transition-transform duration-150 hover:scale-110',
                                        btnColor === c.hex
                                            ? 'border-slate-800 dark:border-white scale-110 shadow-md'
                                            : 'border-transparent',
                                    )}
                                    style={{ backgroundColor: c.hex }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Live preview */}
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center justify-center min-h-[48px]">
                        {btnText ? (
                            <span
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 18px',
                                    backgroundColor: btnColor,
                                    color: needsWhiteText(btnColor) ? '#ffffff' : '#1e293b',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                }}
                            >
                                {btnText}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400 italic">Preview will appear here</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className={cn(
                                'flex-1 rounded-lg border border-slate-200 dark:border-slate-700 py-1.5 text-xs font-semibold',
                                'text-slate-600 dark:text-slate-300',
                                'hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleInsert}
                            disabled={!btnText.trim()}
                            className={cn(
                                'flex-1 rounded-lg py-1.5 text-xs font-semibold text-white transition-all',
                                'bg-indigo-600 hover:bg-indigo-700 active:scale-95',
                                'disabled:opacity-40 disabled:pointer-events-none',
                            )}
                        >
                            Insert
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * InputRichText — a fully-controlled Markdown editor that integrates with the
 * application design system.  Uses @uiw/react-md-editor under the hood.
 *
 * Prop contract is intentionally kept identical to the previous implementation
 * so all existing consumers continue to work without any changes.
 */
export const InputRichText = React.forwardRef<RefMDEditor, InputRichTextProps>(
    (
        {
            id,
            label,
            error,
            required,
            value,
            onChange,
            onBlur,
            placeholder,
            className,
            disabled = false,
        },
        ref,
    ) => {
        /**
         * MDEditor's onChange passes `value?: string`.
         * Normalise to the `(value: string) => void` signature our consumers expect.
         */
        const handleChange = (newValue?: string) => {
            onChange?.(newValue ?? '');
        };

        /**
         * Appends an HTML snippet (e.g. a styled <a> button) to the current
         * editor content, separated by a blank line for clean Markdown rendering.
         */
        const handleInsertButton = (html: string) => {
            const current = value ?? '';
            const separator = current.trimEnd().length > 0 ? '\n\n' : '';
            onChange?.(`${current.trimEnd()}${separator}${html}`);
        };

        return (
            <div className="space-y-2">
                {/* Label row */}
                <div className="flex justify-between items-center">
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </label>

                    {/* Insert Button helper — only shown when not disabled */}
                    <InsertButtonPopover onInsert={handleInsertButton} disabled={disabled} />
                </div>

                {/* Editor wrapper — mirrors border/radius/spacing of other form
                    components in the design system */}
                <div
                    className={cn(
                        'rounded-md border overflow-hidden',
                        error
                            ? 'border-red-500'
                            : 'border-slate-200 dark:border-slate-800',
                        disabled && 'opacity-60 pointer-events-none',
                        className,
                    )}
                    /*
                     * Bubble the blur event up to the containing div so onBlur fires
                     * when focus leaves the entire editor (textarea + toolbar).
                     */
                    onBlur={onBlur}
                >
                    <MDEditor
                        id={id}
                        ref={ref}
                        value={value ?? ''}
                        onChange={handleChange}
                        textareaProps={{
                            placeholder,
                            disabled,
                            id,
                            'aria-required': required,
                            'aria-invalid': Boolean(error),
                            'aria-describedby': error ? `${id}-error` : undefined,
                        }}
                        /*
                         * Respect the application's colour mode.  We read the
                         * `data-color-mode` attribute that next-themes / the app sets
                         * on <html>, but fall back to light so the editor never has an
                         * unstyled appearance.
                         */
                        data-color-mode={
                            typeof document !== 'undefined' &&
                            document.documentElement.classList.contains('dark')
                                ? 'dark'
                                : 'light'
                        }
                        // height={300}
                        autoFocus={false}
                        minHeight={200}
                        visibleDragbar={false}
                        preview="live"
                        /* Keep fullscreen contained so it doesn't break the layout */
                        overflow={false}
                        className="!border-0 !rounded-none w-full"
                        style={{ height: 'auto' }}
                    />
                </div>

                {/* Validation error message */}
                {error && (
                    <p
                        id={`${id}-error`}
                        className="text-[10px] font-bold text-red-500 uppercase"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

InputRichText.displayName = 'InputRichText';

