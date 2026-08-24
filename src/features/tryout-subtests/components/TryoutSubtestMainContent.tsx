import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useTryoutSubtestIndex,
    useTryoutSubtestCreate,
    useTryoutSubtestUpdate,
    useTryoutSubtestDelete,
    TryoutSubtestEntity,
    TryoutSubtestCreateSchema,
    TryoutSubtestCreatePayload,
} from '@/services/tryout-subtests';
import { TryoutSubtestMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';

const TryoutSubtestMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortBy, setSortBy] = useState<string>('order');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari subtes...',
            value: search,
            onChange: setSearch,
        },
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutSubtestIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTryoutSubtestCreate();
    const editMutation = useTryoutSubtestUpdate();
    const deleteMutation = useTryoutSubtestDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Judul',
            key: 'title',
            sortable: true,
            render: (item: TryoutSubtestEntity) => <span className="font-semibold">{item.title}</span>,
        },
        {
            title: 'Urutan',
            key: 'order',
            sortable: true,
        },
        {
            title: 'Durasi',
            key: 'duration_minutes',
            sortable: true,
            render: (item: TryoutSubtestEntity) => `${item.duration_minutes ?? 0} menit`,
        },
        {
            title: 'Sistem Penilaian',
            key: 'scoring_system',
            sortable: true,
            render: (item: TryoutSubtestEntity) => {
                const map: Record<string, string> = {
                    irt: 'Item Response Theory (IRT)',
                    raw_score: 'Skor Mentah',
                    negative_marking: 'Sistem Minus',
                    weighted: 'Bobot Spesifik',
                    graded: 'Berjenjang',
                };
                return map[item.scoring_system ?? ''] || item.scoring_system;
            },
        },
        {
            title: 'Jumlah Soal',
            key: 'total_questions',
            render: (item: TryoutSubtestEntity) => item.total_questions ?? '-',
        },
    ], []);

    return (
        <DataPageTemplate<TryoutSubtestEntity, TryoutSubtestCreatePayload>
            title="Subtes Tryout"
            description="Kelola subtes dan bagian dari setiap paket tryout."
            columns={columns}
            data={displayItems}
            isLoading={isLoading}
            enableColumnToggle
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationMode="modal"
            mutationForm={{
                component: TryoutSubtestMutationForm,
                resolver: zodResolver(TryoutSubtestCreateSchema) as Resolver<TryoutSubtestCreatePayload>,
                emptyValues: {
                    tryout_id: null,
                    title: '',
                    order: 1,
                    duration_minutes: 30,
                    scoring_system: 'raw_score',
                    correct_point: null,
                    wrong_point: null,
                    empty_point: null,
                    passing_grade: null,
                },
                defaultValues: (item) => ({
                    tryout_id: item.tryout_id ?? null,
                    title: item.title ?? '',
                    order: item.order ?? 1,
                    duration_minutes: item.duration_minutes ?? 30,
                    scoring_system: item.scoring_system ?? 'raw_score',
                    correct_point: item.correct_point ?? null,
                    wrong_point: item.wrong_point ?? null,
                    empty_point: item.empty_point ?? null,
                    passing_grade: item.passing_grade ?? null,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah',
                    modalTitle: 'Tambah Subtes',
                    modalSize: 'md',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Subtes — ${item.title}`,
                    modalSize: 'md',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
        />
    );
};

export default TryoutSubtestMainContent;
