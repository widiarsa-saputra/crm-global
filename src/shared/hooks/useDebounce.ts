import { useState, useEffect } from 'react';

/**
 * Hook kustom untuk men-debounce sebuah nilai.
 * @param value Nilai yang ingin di-debounce (misalnya, dari input search).
 * @param delay Waktu tunda dalam milidetik.
 * @returns Nilai yang telah di-debounce.
 */
export function useDebounce<T>(value: T, delay: number): T {
    // State untuk menyimpan nilai yang sudah di-debounce
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set timeout baru setiap kali 'value' berubah
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Bersihkan timeout jika 'value' atau 'delay' berubah, atau saat komponen unmount
        // Ini mencegah nilai di-set setelah komponen tidak lagi ada
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Hanya jalankan efek jika value atau delay berubah

    return debouncedValue;
}