import { useMemo } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Tentukan props untuk komponen kita
interface DaySelectProps<T extends FieldValues> {
    /** Kontrol dari react-hook-form `useForm` */
    control: Control<T>;
    /** Nama field yang terdaftar di react-hook-form */
    name: Path<T>;
    /** Teks label yang akan ditampilkan di atas select */
    label?: string;
    /** Teks placeholder saat tidak ada nilai yang dipilih */
    placeholder?: string;
    /** ClassName untuk kustomisasi container (FormItem) */
    className?: string;
    /** ClassName untuk kustomisasi label */
    labelClassName?: string;
    /** ClassName untuk kustomisasi trigger (bagian yang terlihat dari select) */
    triggerClassName?: string;
    /** Opsional untuk menonaktifkan select */
    disabled?: boolean;
}

/**
 * Komponen DaySelect yang terintegrasi dengan react-hook-form dan shadcn/ui.
 * Memungkinkan pemilihan tanggal dari 1 hingga 31.
 */
export function DaySelect<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Pilih tanggal",
    className,
    labelClassName,
    triggerClassName,
    disabled = false,
}: DaySelectProps<T>) {

    // Gunakan useMemo agar array tidak dibuat ulang pada setiap render
    const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <FormItem className={cn("w-full", className)}>
                    {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
                    <Select
                        // Konversi nilai (yang bisa jadi number) ke string untuk Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                            // Konversi kembali ke number saat menyimpan ke form state
                            field.onChange(value ? parseInt(value, 10) : undefined);
                        }}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={cn(triggerClassName)}
                                aria-invalid={!!error} // Untuk aksesibilitas
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {days.map((day) => (
                                <SelectItem key={day} value={String(day)}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* FormMessage akan otomatis menampilkan error dari react-hook-form */}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}