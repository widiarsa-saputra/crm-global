import React, { useEffect, useRef, useState } from "react";

interface ImageUploadWithPreviewProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    className?: string;
    label?: string;
    renderPreview?: (
        file: File,
        url: string,
        onRemove: () => void
    ) => React.ReactNode;
    renderTrigger?: (onClick: () => void) => React.ReactNode;
    disableInput?: boolean;        // new prop
    showTrigger?: boolean;         // new prop, default true
}

export const ImageUploadWithPreview: React.FC<ImageUploadWithPreviewProps> = ({
    value,
    onChange,
    className,
    label = "Upload Image",
    renderPreview,
    renderTrigger,
    disableInput = false,
    showTrigger = true,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (value) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file);
    };

    const handleRemove = () => {
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={className}>
            {label && (
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {value && previewUrl ? (
                renderPreview ? (
                    renderPreview(value, previewUrl, handleRemove)
                ) : (
                    <div className="relative w-40 h-40 border rounded-md overflow-hidden shadow">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                        <button
                            type="button"
                            className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white"
                            onClick={handleRemove}
                            aria-label="Remove image"
                        >
                            ✕
                        </button>
                    </div>
                )
            ) : showTrigger ? (
                renderTrigger ? renderTrigger(handleClick) : (
                    <button type="button" onClick={handleClick}>
                        {label}
                    </button>
                )
            ) : null}

            {!disableInput && (
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            )}
        </div>
    );
};

