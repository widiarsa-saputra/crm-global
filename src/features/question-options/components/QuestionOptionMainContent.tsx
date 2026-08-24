import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useQuestionOptionIndex,
    useQuestionOptionCreate,
    useQuestionOptionUpdate,
    useQuestionOptionDelete,
    QuestionOptionEntity,
    QuestionOptionCreateSchema,
    QuestionOptionCreatePayload,
} from '@/services/question-options';
import { QuestionOptionMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import { useQuestionBankIndex, QuestionBankEntity } from '@/services/question-banks';
import LabelComp from '@/components/LabelComp';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuestionOptionMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const initialFilterState: {
        question_bank_id: string | undefined;
        question_bank_data: QuestionBankEntity | undefined;
    } = {
        question_bank_id: undefined,
        question_bank_data: undefined,
    };
    const [filter, setFilter] = useState(initialFilterState);
    const [tempFilter, setTempFilter] = useState(initialFilterState);
    const [filterLabels, setFilterLabels] = useState<string[]>([]);

    const [questionBankSearch, setQuestionBankSearch] = useState('');
    const debouncedQuestionBankSearch = useDebounce(questionBankSearch, 500);

    const { data: questionBankData, isLoading: isLoadingQuestionBank } = useQuestionBankIndex({
        search: debouncedQuestionBankSearch,
        paginate: 30,
    });

    const questionBankOptions = (questionBankData?.data ?? []).map(qb => ({
        label: qb.question_text ?? '',
        value: String(qb.id),
        data: qb,
    }));

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari opsi jawaban...',
            value: search,
            onChange: setSearch,
        },
        filter: {
            content: (
                <div className="flex flex-col gap-4">
                    <div>
                        <LabelComp>Bank Soal</LabelComp>
                        <SearchableSelect
                            options={questionBankOptions}
                            value={tempFilter.question_bank_id || ''}
                            onChange={(val) => {
                                const valStr = val as string;
                                let questionBankData = undefined;
                                if (valStr) {
                                    const selectedOpt = questionBankOptions.find(opt => opt.value === valStr);
                                    if (selectedOpt && selectedOpt.data) {
                                        questionBankData = selectedOpt.data;
                                    }
                                }
                                setTempFilter(prev => ({ ...prev, question_bank_id: valStr || undefined, question_bank_data: questionBankData }));
                            }}
                            placeholder="Semua Soal"
                            serverSideSearch
                            searchValue={questionBankSearch}
                            onSearchChange={setQuestionBankSearch}
                            isPending={isLoadingQuestionBank}
                        />
                    </div>
                </div>
            ),
            onClear: () => {
                setFilter(initialFilterState);
                setTempFilter(initialFilterState);
            },
            onApply: () => {
                setFilter(tempFilter);
            },
        },
    }), [search, tempFilter, questionBankOptions, questionBankSearch, isLoadingQuestionBank]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useQuestionOptionIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        filter: {
            question_bank_id: filter.question_bank_id,
        },
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useQuestionOptionCreate();
    const editMutation = useQuestionOptionUpdate();
    const deleteMutation = useQuestionOptionDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, filter, sortBy, sortOrder]);

    useEffect(() => {
        const labels: string[] = [];
        if (filter.question_bank_data?.question_text) {
            labels.push(`Soal: ${filter.question_bank_data.question_text}`);
        }
        setFilterLabels(labels);
    }, [filter]);

    const gridRenderItem = (item: QuestionOptionEntity, actionsNode: React.ReactNode) => {
        return (
            <article className="flex flex-col h-full hover:shadow-md transition-shadow border rounded-lg overflow-hidden bg-card">
                <header className="p-4 bg-muted/30 border-b flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-muted-foreground line-clamp-1">
                        Soal ID {item.question_bank_id ?? '-'}
                    </span>
                    {item.is_correct ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Kunci Jawaban
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            <XCircle className="w-3.5 h-3.5" />
                            Opsi Biasa
                        </div>
                    )}
                </header>
                <section className="flex-1 p-4 flex flex-col gap-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1 text-foreground">
                        {item.option_text ?? '-'}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4 border-t pt-3 border-dashed">
                        <div>
                            <span className="font-semibold block mb-0.5">Nilai (Score)</span>
                            {item.score ?? 0}
                        </div>
                        {item.similarity_boundary != null && (
                            <div>
                                <span className="font-semibold block mb-0.5">Similarity (%)</span>
                                {item.similarity_boundary}
                            </div>
                        )}
                    </div>
                </section>
                <section className="p-2 bg-muted/20 border-t flex justify-end gap-2">
                    {actionsNode}
                </section>
            </article>
        );
    };

    return (
        <DataPageTemplate<QuestionOptionEntity, QuestionOptionCreatePayload>
            title="Opsi Jawaban"
            description="Kelola pilihan jawaban mandiri (di luar payload JSON) untuk soal tipe tertentu."
            columns={[]}
            data={displayItems}
            isLoading={isLoading}
            filterLabels={filterLabels}
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
            gridRenderItem={gridRenderItem}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            mutationMode="modal"
            mutationForm={{
                component: QuestionOptionMutationForm,
                resolver: zodResolver(QuestionOptionCreateSchema) as Resolver<QuestionOptionCreatePayload>,
                emptyValues: {
                    question_bank_id: null,
                    option_text: '',
                    is_correct: false,
                    score: null,
                    similarity_boundary: null,
                },
                defaultValues: (item) => ({
                    question_bank_id: item.question_bank_id ?? null,
                    option_text: item.option_text ?? '',
                    is_correct: item.is_correct ?? false,
                    score: item.score ?? null,
                    similarity_boundary: item.similarity_boundary ?? null,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Opsi',
                    modalTitle: 'Tambah Opsi Jawaban',
                    modalSize: 'sm',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Opsi Jawaban (ID: ${item.id})`,
                    modalSize: 'sm',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
        />
    );
};

export default QuestionOptionMainContent;
