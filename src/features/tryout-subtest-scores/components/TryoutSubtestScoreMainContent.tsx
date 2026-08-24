import React, { useMemo, useState, useEffect } from 'react';
import { BaseTable } from '@/shared/components/table/BaseTable';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions, TopbarActions } from '@/shared/context/TopbarActionContext';
import { TryoutSubtestScoreEntity, useTryoutSubtestScoreIndex } from '@/services/tryout-subtest-scores';
import { ScoreRadarChart, ScoreBarChart, ScoreStatCards } from '.';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TryoutSubtestScoreMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedId, setExpandedId] = useState<string | number | null>(null);

    const topbarConfig = useMemo<TopbarActions>(() => ({
        search: {
            placeholder: 'Cari siswa...',
            value: search,
            onChange: setSearch,
        },
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutSubtestScoreIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
    });

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage]);

    const columns = useMemo(() => [
        {
            title: 'Siswa',
            key: 'student_name',
            render: (item: TryoutSubtestScoreEntity) => item.student_name ?? '-',
            sortable: true,
        },
        {
            title: 'Peringkat',
            key: 'rank',
            render: (item: TryoutSubtestScoreEntity) =>
                item.rank != null ? `#${item.rank}` : '-',
        },
        {
            title: 'Persentil',
            key: 'percentile',
            render: (item: TryoutSubtestScoreEntity) =>
                item.percentile != null ? `${item.percentile.toFixed(0)}%` : '-',
        },
        {
            title: 'Rata-rata Skor',
            key: 'average_scaled_score',
            render: (item: TryoutSubtestScoreEntity) =>
                item.average_scaled_score != null
                    ? item.average_scaled_score.toFixed(1)
                    : '-',
        },
        {
            title: 'Detail',
            key: 'expand',
            render: (item: TryoutSubtestScoreEntity) => (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    aria-expanded={expandedId === item.id}
                    aria-label={expandedId === item.id ? 'Tutup detail' : 'Lihat detail'}
                >
                    {expandedId === item.id
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    }
                </Button>
            ),
        },
    ], [expandedId]);

    // Expanded detail row — render chart di bawah tiap baris
    const expandedItem = displayItems.find((i: TryoutSubtestScoreEntity) => i.id === expandedId) ?? null;

    return (
        <div className="p-4 h-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Skor Subtes Tryout</h1>
                    <p className="text-muted-foreground text-sm">Lihat dan analisis skor subtes siswa per tryout.</p>
                </div>
            </div>

            <BaseTable
                columns={columns}
                data={displayItems}
                isLoading={isLoading}
            />

            {/* Detail chart untuk baris yang di-expand */}
            {expandedItem && (expandedItem.subtest_breakdown?.length ?? 0) > 0 && (
                <div className="rounded-lg border bg-card p-4 flex flex-col gap-4">
                    <div className="font-medium text-sm">
                        Detail: {expandedItem.student_name ?? `Siswa #${expandedItem.id}`}
                    </div>
                    <ScoreStatCards item={expandedItem} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <ScoreRadarChart
                            data={expandedItem.subtest_breakdown ?? []}
                            studentName={expandedItem.student_name}
                        />
                        <ScoreBarChart data={expandedItem.subtest_breakdown ?? []} />
                    </div>
                </div>
            )}

            <PaginationWithShow
                currentPage={currentPage}
                totalItems={response?.pagination?.total ?? 0}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />
        </div>
    );
};

export default TryoutSubtestScoreMainContent;
