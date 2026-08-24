import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useTryoutSubtestResultIndex,
    useTryoutSubtestResultCreate,
    useTryoutSubtestResultUpdate,
    useTryoutSubtestResultDelete,
    TryoutSubtestResultEntity,
    TryoutSubtestResultCreateSchema,
    TryoutSubtestResultCreatePayload,
} from '@/services/tryout-subtest-results';
import { TryoutSubtestResultMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';

const TryoutSubtestResultMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari hasil subtes...',
            value: search,
            onChange: setSearch,
        },
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutSubtestResultIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTryoutSubtestResultCreate();
    const editMutation = useTryoutSubtestResultUpdate();
    const deleteMutation = useTryoutSubtestResultDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Attempt ID',
            key: 'tryout_attempt_id',
            sortable: true,
            render: (item: TryoutSubtestResultEntity) => <span className="font-semibold">{item.tryout_attempt_id}</span>,
        },
        {
            title: 'Subtest ID',
            key: 'subtest_id',
            sortable: true,
        },
        {
            title: 'Lulus?',
            key: 'is_passed',
            sortable: true,
            render: (item: TryoutSubtestResultEntity) => item.is_passed ? 'Ya' : 'Tidak',
        },
        {
            title: 'Score',
            key: 'subtest_score',
            sortable: true,
        },
        {
            title: 'T. Score (IRT)',
            key: 'theta_score',
            sortable: true,
            render: (item: TryoutSubtestResultEntity) => item.theta_score != null ? item.theta_score.toFixed(2) : '-',
        },
        {
            title: 'Total Benar',
            key: 'total_correct',
            sortable: true,
        },
    ], []);

    return (
        <DataPageTemplate<TryoutSubtestResultEntity, TryoutSubtestResultCreatePayload>
            title="Hasil Subtes"
            description="Kelola rekapitulasi hasil pengerjaan subtes dari tiap attempt."
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
                component: TryoutSubtestResultMutationForm,
                resolver: zodResolver(TryoutSubtestResultCreateSchema) as Resolver<TryoutSubtestResultCreatePayload>,
                emptyValues: {
                    tryout_attempt_id: null,
                    subtest_id: null,
                    total_qanswered: null,
                    total_correct: null,
                    total_wrong: null,
                    total_empty: null,
                    theta_score: null,
                    standard_error: null,
                    scaled_error: null,
                    is_passed: false,
                    started_at: new Date().toISOString(),
                    submitted_at: null,
                    correct_score: null,
                    wrong_score: null,
                    empty_score: null,
                    subtest_score: 0,
                },
                defaultValues: (item) => ({
                    tryout_attempt_id: item.tryout_attempt_id ?? null,
                    subtest_id: item.subtest_id ?? null,
                    total_qanswered: item.total_qanswered ?? null,
                    total_correct: item.total_correct ?? null,
                    total_wrong: item.total_wrong ?? null,
                    total_empty: item.total_empty ?? null,
                    theta_score: item.theta_score ?? null,
                    standard_error: item.standard_error ?? null,
                    scaled_error: item.scaled_error ?? null,
                    is_passed: item.is_passed ?? false,
                    started_at: item.started_at ?? new Date().toISOString(),
                    submitted_at: item.submitted_at ?? null,
                    correct_score: item.correct_score ?? null,
                    wrong_score: item.wrong_score ?? null,
                    empty_score: item.empty_score ?? null,
                    subtest_score: item.subtest_score ?? 0,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah',
                    modalTitle: 'Tambah Hasil Subtes',
                    modalSize: 'lg',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Hasil Subtes — ${item.subtest_id}`,
                    modalSize: 'lg',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
        />
    );
};

export default TryoutSubtestResultMainContent;
