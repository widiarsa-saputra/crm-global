import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

// Expose katex to window for Quill formula module
if (typeof window !== 'undefined') {
    (window as unknown as Window & Record<string, unknown>).katex = katex;
}

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
}

export const InputRichText = React.forwardRef<ReactQuill, InputRichTextProps>(
    ({ id, label, error, required, value, onChange, onBlur, placeholder, className }, ref) => {
        const modules = useMemo(() => ({
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'formula'],
                ['clean']
            ],
        }), []);

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                </div>
                <div className={cn(
                    "bg-white dark:bg-slate-950 rounded-md",
                    error ? "border border-red-500 rounded-md" : "",
                    className
                )}>
                    <ReactQuill
                        ref={ref}
                        theme="snow"
                        value={DOMPurify.sanitize(value || '')}
                        onChange={(val) => onChange?.(DOMPurify.sanitize(val))}
                        onBlur={onBlur}
                        modules={modules}
                        placeholder={placeholder}
                        className="min-h-[200px] pb-12"
                    />
                </div>
                {error && <p className="text-[10px] font-bold text-red-500 uppercase">{error}</p>}
            </div>
        );
    }
);

InputRichText.displayName = "InputRichText";
