import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useTryoutAttemptAnswerIndex,
    useTryoutAttemptAnswerCreate,
    useTryoutAttemptAnswerUpdate,
    useTryoutAttemptAnswerDelete,
    TryoutAttemptAnswerEntity,
    TryoutAttemptAnswerCreateSchema,
    TryoutAttemptAnswerCreatePayload,
} from '@/services/tryout-attempt-answers';
import { TryoutAttemptAnswerMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';

const TryoutAttemptAnswerMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari data jawaban...',
            value: search,
            onChange: setSearch,
        },
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutAttemptAnswerIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTryoutAttemptAnswerCreate();
    const editMutation = useTryoutAttemptAnswerUpdate();
    const deleteMutation = useTryoutAttemptAnswerDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Attempt ID',
            key: 'tryout_attempt_id',
            sortable: true,
            render: (item: TryoutAttemptAnswerEntity) => <span className="font-semibold">{item.tryout_attempt_id}</span>,
        },
        {
            title: 'Question ID',
            key: 'tryout_question_id',
            sortable: true,
        },
        {
            title: 'Option ID',
            key: 'question_option_id',
            sortable: true,
        },
        {
            title: 'Benar?',
            key: 'is_correct',
            sortable: true,
            render: (item: TryoutAttemptAnswerEntity) => item.is_correct ? 'Ya' : 'Tidak',
        },
        {
            title: 'Score',
            key: 'score_earned',
            sortable: true,
        },
        {
            title: 'Status Grading',
            key: 'grading_status',
            sortable: true,
        },
    ], []);

    return (
        <DataPageTemplate<TryoutAttemptAnswerEntity, TryoutAttemptAnswerCreatePayload>
            title="Jawaban Siswa"
            description="Kelola data riwayat jawaban per-soal dari siswa."
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
                component: TryoutAttemptAnswerMutationForm,
                resolver: zodResolver(TryoutAttemptAnswerCreateSchema) as Resolver<TryoutAttemptAnswerCreatePayload>,
                emptyValues: {
                    tryout_attempt_id: null,
                    tryout_question_id: null,
                    question_option_id: null,
                    is_correct: false,
                    score_earned: null,
                    response_time_seconds: null,
                    is_flagged: false,
                    essay_answer_text: null,
                    grading_status: 'pending_review',
                },
                defaultValues: (item) => ({
                    tryout_attempt_id: item.tryout_attempt_id ?? null,
                    tryout_question_id: item.tryout_question_id ?? null,
                    question_option_id: item.question_option_id ?? null,
                    is_correct: item.is_correct ?? false,
                    score_earned: item.score_earned ?? null,
                    response_time_seconds: item.response_time_seconds ?? null,
                    is_flagged: item.is_flagged ?? false,
                    essay_answer_text: item.essay_answer_text ?? null,
                    grading_status: item.grading_status ?? 'pending_review',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah',
                    modalTitle: 'Tambah Jawaban',
                    modalSize: 'lg',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Jawaban — ${item.tryout_question_id}`,
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

export default TryoutAttemptAnswerMainContent;
