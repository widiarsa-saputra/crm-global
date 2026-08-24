// hooks/useCheckboxSelectSingleRow.ts
import { useMemo, useState } from "react";

export function useCheckboxSelectSingleRow<T>(
    data: T[],
    keySelector: (item: T) => string
) {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const allKeys = useMemo(() => data.map(keySelector), [data, keySelector]);

    const allSelected = useMemo(
        () => allKeys.every((key) => selectedKeys.includes(key)),
        [allKeys, selectedKeys]
    );

    const toggleAll = () => {
        setSelectedKeys(allSelected ? [] : allKeys);
    };

    const toggleItem = (key: string) => {
        setSelectedKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    return {
        selectedKeys,
        setSelectedKeys,
        allSelected,
        toggleAll,
        toggleItem,
    };
}
