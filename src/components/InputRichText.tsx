import React from 'react';
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
