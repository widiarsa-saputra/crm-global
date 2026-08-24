// hooks/useCheckboxSelectCrossRow.ts
export function useCheckboxSelectCrossRow(
    currentSelected: string[],
    targetKeys: string[]
) {
    const allSelected = targetKeys.every((key) => currentSelected.includes(key));

    const toggleAll = (): string[] => {
        return allSelected
            ? currentSelected.filter((key) => !targetKeys.includes(key))
            : Array.from(new Set([...currentSelected, ...targetKeys]));
    };

    const toggleItem = (key: string): string[] => {
        return currentSelected.includes(key)
            ? currentSelected.filter((k) => k !== key)
            : [...currentSelected, key];
    };

    return { allSelected, toggleAll, toggleItem };
}
