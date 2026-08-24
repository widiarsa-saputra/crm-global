import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import React from "react"

export interface FormFieldProps {
    name: string
    label: string
    placeholder?: string
    type?: string
    register: UseFormRegister<any>  // <- bisa diganti `UseFormRegister<T>` kalau ingin generic
    errors: FieldErrors             // <- ini penting, supaya tipe errornya cocok
    inputClassName?: string
    customComponent?: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    placeholder,
    type = "text",
    register,
    errors,
    inputClassName,
    customComponent
}) => {
    const error = errors[name]

    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            {customComponent ? (
                customComponent
            ) : (
                <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    className={cn(
                        "selection:bg-blue-300 selection:text-white border",
                        error ? "border-red-500" : "border-gray-300",
                        inputClassName
                    )}
                    {...register(name)}
                />
            )}
            {error && (
                <span className="text-red-500 text-sm">
                    {(error as any).message}
                </span>
            )}
        </div>
    )
}
