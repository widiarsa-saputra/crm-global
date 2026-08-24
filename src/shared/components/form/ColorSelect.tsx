import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

// Komponen UI & Form
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Palet warna yang telah ditentukan. Anda bisa menambah atau mengubahnya.
const PREDEFINED_COLORS = [
    '#EF4444', // Red-500
    '#F97316', // Orange-500
    '#F59E0B', // Amber-500
    '#EAB308', // Yellow-500
    '#84CC16', // Lime-500
    '#22C55E', // Green-500
    '#10B981', // Emerald-500
    '#06B6D4', // Cyan-500
    '#0EA5E9', // Sky-500
    '#3B82F6', // Blue-500
    '#6366F1', // Indigo-500
    '#8B5CF6', // Violet-500
    '#A855F7', // Purple-500
    '#D946EF', // Fuchsia-500
    '#EC4899', // Pink-500
    '#64748B', // Slate-500
];

interface ColorSelectProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * Komponen pemilih warna yang terintegrasi dengan react-hook-form.
 * Menampilkan palet warna dan input untuk kode hex kustom.
 */
export function ColorSelect<T extends FieldValues>({
    control,
    name,
    label = "Color",
    className,
    disabled = false,
}: ColorSelectProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("w-full", className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={disabled}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-4 w-4 rounded border"
                                            style={{ backgroundColor: field.value || 'transparent' }}
                                        />
                                        {field.value ? field.value.toUpperCase() : "Select a color"}
                                    </div>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <div className="p-4">
                                <div className="grid grid-cols-8 gap-2">
                                    {PREDEFINED_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={cn(
                                                "h-6 w-6 rounded border-2 transition-all",
                                                field.value?.toUpperCase() === color
                                                    ? "ring-2 ring-offset-2 ring-ring"
                                                    : "border-transparent"
                                            )}
                                            style={{ backgroundColor: color }}
                                            onClick={() => field.onChange(color)}
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">#</span>
                                    <Input
                                        value={field.value?.replace('#', '') || ''}
                                        onChange={(e) => field.onChange(`#${e.target.value}`)}
                                        className="h-8"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}