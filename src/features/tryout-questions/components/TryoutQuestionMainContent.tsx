import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useTryoutQuestionIndex,
    useTryoutQuestionCreate,
    useTryoutQuestionUpdate,
    useTryoutQuestionDelete,
    TryoutQuestionEntity,
    TryoutQuestionCreateSchema,
    TryoutQuestionCreatePayload,
} from '@/services/tryout-questions';
import { TryoutQuestionMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import { useTryoutIndex, TryoutEntity } from '@/services/tryouts';
import { useQuestionBankIndex, QuestionBankEntity } from '@/services/question-banks';
import LabelComp from '@/components/LabelComp';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';

import { Badge } from '@/components/ui/badge';
import { cn, difficultyOptions, getDifficultyLabel } from '@/lib/utils';

const TryoutQuestionMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(21);

    const initialFilterState: {
        tryout_id: string | undefined;
        tryout_data: TryoutEntity | undefined;
        question_bank_id: string | undefined;
        question_bank_data: QuestionBankEntity | undefined;
    } = {
        tryout_id: undefined,
        tryout_data: undefined,
        question_bank_id: undefined,
        question_bank_data: undefined,
    };
    const [filter, setFilter] = useState(initialFilterState);
    const [tempFilter, setTempFilter] = useState(initialFilterState);
    const [filterLabels, setFilterLabels] = useState<string[]>([]);

    const [tryoutSearch, setTryoutSearch] = useState('');
    const debouncedTryoutSearch = useDebounce(tryoutSearch, 500);

    const [questionBankSearch, setQuestionBankSearch] = useState('');
    const debouncedQuestionBankSearch = useDebounce(questionBankSearch, 500);

    const { data: tryoutData, isLoading: isLoadingTryout } = useTryoutIndex({
        search: debouncedTryoutSearch,
        paginate: 30,
    });

    const { data: questionBankData, isLoading: isLoadingQuestionBank } = useQuestionBankIndex({
        search: debouncedQuestionBankSearch,
        paginate: 30,
    });

    const tryoutOptions = (tryoutData?.data ?? []).map(tryout => ({
        label: tryout.title ?? '',
        value: String(tryout.id),
        data: tryout,
    }));

    const questionBankOptions = (questionBankData?.data ?? []).map(qb => ({
        label: qb.question_text ?? '',
        value: String(qb.id),
        data: qb,
    }));

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari soal tryout...',
            value: search,
            onChange: setSearch,
        },
        filter: {
            content: (
                <div className="flex flex-col gap-4">
                    <div>
                        <LabelComp>Tryout</LabelComp>
                        <SearchableSelect
                            options={tryoutOptions}
                            value={tempFilter.tryout_id || ''}
                            onChange={(val) => {
                                const valStr = val as string;
                                let tryoutData = undefined;
                                if (valStr) {
                                    const selectedOpt = tryoutOptions.find(opt => opt.value === valStr);
                                    if (selectedOpt && selectedOpt.data) {
                                        tryoutData = selectedOpt.data;
                                    }
                                }
                                setTempFilter(prev => ({ ...prev, tryout_id: valStr || undefined, tryout_data: tryoutData }));
                            }}
                            placeholder="Semua Tryout"
                            serverSideSearch
                            searchValue={tryoutSearch}
                            onSearchChange={setTryoutSearch}
                            isPending={isLoadingTryout}
                        />
                    </div>
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
                            placeholder="Semua Bank Soal"
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
    }), [search, tempFilter, tryoutOptions, tryoutSearch, isLoadingTryout, questionBankOptions, questionBankSearch, isLoadingQuestionBank]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutQuestionIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'tryout,questionBank',
        filter: {
            tryout_id: filter.tryout_id,
            question_bank_id: filter.question_bank_id,
        },
        sort_by: 'order',
        sort_order: 'asc',
    });

    const addMutation = useTryoutQuestionCreate();
    const editMutation = useTryoutQuestionUpdate();
    const deleteMutation = useTryoutQuestionDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, filter]);

    useEffect(() => {
        const labels: string[] = [];
        if (filter.tryout_data?.title) {
            labels.push(`Tryout: ${filter.tryout_data.title}`);
        }
        if (filter.question_bank_data?.question_text) {
            labels.push(`Soal: ${filter.question_bank_data.question_text}`);
        }
        setFilterLabels(labels);
    }, [filter]);

    const gridRenderItem = (item: TryoutQuestionEntity, actionsNode: React.ReactNode) => {
        const qData = item.question_bank;
        let parsedOptions: ({ key?: string; text?: string; value?: string } | string)[] | null = null;
        let correctAnswers: string[] = [];
        
        if (qData?.question_options && Array.isArray(qData.question_options)) {
            parsedOptions = qData.question_options.map((opt: any, i: number) => {
                const key = String.fromCharCode(65 + i);
                if (opt.is_correct) correctAnswers.push(key);
                return { key, text: opt.option_text || '' };
            });
        }

        return (
            <article className="flex flex-col h-full hover:shadow-md transition-shadow border rounded-lg divide-y bg-card">
                <header className="p-2 flex gap-2 justify-between items-start">
                    <section>
                        <h3 className="text-sm font-semibold text-primary line-clamp-1 pl-2">
                            {/* Wait, the API might not include 'subtest' relation yet, fallback to subtest_id */}
                            {`Subtest ID ${item.subtest_id}`}
                        </h3>
                    </section>
                    <section className='flex flex-col gap-1 items-end'>
                        <Badge variant={qData?.question_type === 'multiple_choice' ? 'default' : qData?.question_type === 'multiple_select' ? 'secondary' : 'outline'} className='capitalize w-max'>
                            {qData?.question_type?.replace('_', ' ')}
                        </Badge>
                        <p className={cn(
                            'text-xs font-semibold capitalize',
                            difficultyOptions.find(opt => opt.value === qData?.difficulty)?.color
                        )}>
                            {getDifficultyLabel(qData?.difficulty ?? '')}
                        </p>
                    </section>
                </header>
                <section className="flex-1 py-4 flex flex-col gap-4 px-4">
                    {qData ? (
                        <>
                            <p
                                className="text-sm leading-relaxed text-foreground whitespace-pre-wrap flex-1"
                                title={qData.question_text ?? ''}
                            >
                                {qData.question_text}{' '}
                            </p>

                            {parsedOptions && Array.isArray(parsedOptions) && (
                                <section className="flex flex-col gap-1 mt-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                                        Pilihan Jawaban:
                                    </h4>

                                    <ul className="flex flex-col gap-1">
                                        {parsedOptions.map((opt, idx: number) => {
                                            const optText = typeof opt === 'string' ? opt : (opt.text ?? opt.value ?? '');
                                            const optKey = typeof opt === 'string'
                                                    ? (qData?.question_type === 'multiple_select' ? String(idx + 1) : String.fromCharCode(65 + idx))
                                                    : (opt.key ?? (qData?.question_type === 'multiple_select' ? String(idx + 1) : String.fromCharCode(65 + idx)));

                                            const isCorrect = correctAnswers.includes(optKey) || correctAnswers.includes(String(optText));

                                            return (
                                                <li
                                                    key={idx}
                                                    className={`flex items-start gap-2 text-xs ${isCorrect
                                                        ? 'text-green-600 dark:text-green-500 font-semibold bg-green-50 dark:bg-green-950/30 rounded-sm'
                                                        : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    <span className="font-bold">{optKey}.</span>
                                                    <span className="line-clamp-1" title={String(optText)}>
                                                        {String(optText)}
                                                    </span>
                                                    {isCorrect && (
                                                        <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded-sm">
                                                            Kunci
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            )}

                            {correctAnswers.length > 0 && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground/80">Kunci Jawaban:</span>{' '}
                                    {correctAnswers.join(', ')}
                                </p>
                            )}
                        </>
                    ) : (
                        <aside className="flex-1 flex items-center justify-center border border-dashed rounded-md p-4 bg-muted/20 flex-1">
                            <p className="text-xs text-muted-foreground text-center">
                                Data soal belum dapat dimuat atau ID Soal tidak ditemukan.
                            </p>
                        </aside>
                    )}

                    <footer className="flex items-end justify-between gap-2 pt-2 bg-muted/20 -mx-6 px-6 -mb-4 pb-4 h-fulls">
                        <dl className="flex gap-1 text-xs">
                            <dt className="text-muted-foreground">Urutan:</dt>
                            <dd className="font-semibold">{item.order ?? 0}</dd>
                        </dl>

                        <dl className="flex gap-1 text-xs">
                            <dt className="text-muted-foreground">Bobot:</dt>
                            <dd className="font-semibold text-primary">
                                {item.weight_point ?? 1}
                            </dd>
                        </dl>
                    </footer>
                </section>
                <section className="p-2 flex justify-end gap-2 bg-muted/20">
                    {actionsNode}
                </section>
            </article>
        );
    };

    return (
        <DataPageTemplate<TryoutQuestionEntity, TryoutQuestionCreatePayload>
            title="Soal Tryout"
            description="Kelola soal-soal untuk setiap subtes tryout."
            columns={[]}
            data={displayItems}
            isLoading={isLoading}
            filterLabels={filterLabels}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            gridRenderItem={gridRenderItem}
            gridClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            mutationMode="modal"
            mutationForm={{
                component: TryoutQuestionMutationForm,
                resolver: zodResolver(TryoutQuestionCreateSchema) as Resolver<TryoutQuestionCreatePayload>,
                emptyValues: {
                    subtest_id: null,
                    question_bank_id: null,
                    order: 0,
                    weight_point: 1,
                    item_discrimination_a: null,
                    item_difficulty_b: null,
                    item_guessing_c: null,
                    calibration_source: null,
                    calibrated_at: null,
                },
                defaultValues: (item) => ({
                    subtest_id: item.subtest_id ?? null,
                    question_bank_id: item.question_bank_id ?? null,
                    order: item.order ?? 0,
                    weight_point: item.weight_point ?? 1,
                    item_discrimination_a: item.item_discrimination_a ?? null,
                    item_difficulty_b: item.item_difficulty_b ?? null,
                    item_guessing_c: item.item_guessing_c ?? null,
                    calibration_source: item.calibration_source ?? null,
                    calibrated_at: item.calibrated_at ?? null,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Soal',
                    modalTitle: 'Tambah Soal Tryout',
                    modalSize: 'md',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Soal — ID ${item.question_bank_id}`,
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

export default TryoutQuestionMainContent;
