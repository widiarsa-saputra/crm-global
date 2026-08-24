import { useRef } from 'react';
import { Input } from './ui/input';
// Format integer to IDR string (1000000 -> "1.000.000")
export const formatNumber = (val: number | null) => {
    if (!val && val !== 0) return '';
    return new Intl.NumberFormat('id-ID').format(val);
};

export function CurrencyInput({ value, onChange, prefix = "Rp " }: { value: number | null, onChange: (value: number | null) => void, prefix?: string }) {
    const inputRef = useRef<HTMLInputElement>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.target;
        const rawInputValue = inputEl.value;
        const currentCursorPos = inputEl.selectionStart || 0;

        // 1. Hitung jumlah digit angka di sebelah kiri kursor sebelum di-format
        let digitsBeforeCursor = 0;
        for (let i = 0; i < currentCursorPos; i++) {
            if (/\d/.test(rawInputValue[i])) {
                digitsBeforeCursor++;
            }
        }

        // 2. Bersihkan karakter non-digit
        const cleanDigits = rawInputValue.replace(/\D/g, '');
        if (!cleanDigits) {
            onChange(null);
            return;
        }

        const numericValue = parseInt(cleanDigits, 10);
        const newFormatted = new Intl.NumberFormat('id-ID').format(numericValue);

        // 3. Cari posisi kursor yang sesuai pada string baru yang terformat
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

        // 4. Kirim nilai integer murni ke Parent Component
        onChange(numericValue);

        // 5. Kembalikan posisi kursor agar tidak melompat ke paling akhir
        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className='text-xs'>
            {prefix && <span style={{ position: 'absolute', left: '12px' }}>{prefix}</span>}
            <Input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={formatNumber(value)}
                onChange={handleChange}
                style={{ paddingLeft: prefix ? '40px' : '12px' }}
            />
        </div>
    );
}