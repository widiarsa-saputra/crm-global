import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useQuestionBankIndex,
    useQuestionBankCreate,
    useQuestionBankUpdate,
    useQuestionBankDelete,
    QuestionBankEntity,
    QuestionBankCreateSchema,
    QuestionBankCreatePayload,
} from '@/services/question-banks';
import { QuestionBankMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import { useLessonIndex, LessonEntity } from '@/services/lessons';
import LabelComp from '@/components/LabelComp';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { Badge } from '@/components/ui/badge';
import { cn, difficultyOptions } from '@/lib/utils';
import NativeSelect from '@/shared/components/form/NativeSelect';

const QuestionBankMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(21);

    const initialFilterState: {
        lesson_id: string | undefined;
        lesson_data: LessonEntity | undefined;
        question_type: string | undefined;
        difficulty: string | undefined;
    } = {
        lesson_id: undefined,
        lesson_data: undefined,
        question_type: undefined,
        difficulty: undefined,
    };
    const [filter, setFilter] = useState(initialFilterState);
    const [tempFilter, setTempFilter] = useState(initialFilterState);
    const [filterLabels, setFilterLabels] = useState<string[]>([]);

    const [lessonSearch, setLessonSearch] = useState('');
    const debouncedLessonSearch = useDebounce(lessonSearch, 500);

    const { data: lessonData, isLoading: isLoadingLesson } = useLessonIndex({
        search: debouncedLessonSearch,
        paginate: 30,
    });

    const lessonOptions = (lessonData?.data ?? []).map(lesson => ({
        label: lesson.title ?? '',
        value: String(lesson.id),
        data: lesson,
    }));

    const typeOptions = [
        { label: 'Semua Tipe', value: '' },
        { label: 'Pilihan Ganda', value: 'multiple_choice' },
        { label: 'Multi Jawaban', value: 'multiple_select' },
        { label: 'Polytomous', value: 'polytomous' },
        { label: 'Jawaban Singkat', value: 'short_answer' },
    ];

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari soal...',
            value: search,
            onChange: setSearch,
        },
        filter: {
            content: (
                <div className="flex flex-col gap-4">
                    <div>
                        <LabelComp>Pelajaran</LabelComp>
                        <SearchableSelect
                            options={lessonOptions}
                            value={tempFilter.lesson_id || ''}
                            onChange={(val) => {
                                const valStr = val as string;
                                let lessonData = undefined;
                                if (valStr) {
                                    const selectedOpt = lessonOptions.find(opt => opt.value === valStr);
                                    if (selectedOpt && selectedOpt.data) {
                                        lessonData = selectedOpt.data;
                                    }
                                }
                                setTempFilter(prev => ({ ...prev, lesson_id: valStr || undefined, lesson_data: lessonData }));
                            }}
                            placeholder="Semua Pelajaran"
                            serverSideSearch
                            searchValue={lessonSearch}
                            onSearchChange={setLessonSearch}
                            isPending={isLoadingLesson}
                        />
                    </div>
                    <div>
                        <LabelComp>Tipe Soal</LabelComp>
                        <NativeSelect
                            options={typeOptions}
                            value={tempFilter.question_type || ''}
                            onChange={(e) => setTempFilter({ ...tempFilter, question_type: e.target.value || undefined })}
                        />
                    </div>
                    <div>
                        <LabelComp>Kesulitan</LabelComp>
                        <NativeSelect
                            options={difficultyOptions}
                            value={tempFilter.difficulty || ''}
                            onChange={(e) => setTempFilter({ ...tempFilter, difficulty: e.target.value || undefined })}
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
    }), [search, tempFilter, lessonOptions, lessonSearch, isLoadingLesson]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useQuestionBankIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        filter: {
            lesson_id: filter.lesson_id,
            question_type: filter.question_type,
            difficulty: filter.difficulty,
        },
        sort_by: 'created_at',
        sort_order: 'desc',
    });

    const addMutation = useQuestionBankCreate();
    const editMutation = useQuestionBankUpdate();
    const deleteMutation = useQuestionBankDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, filter]);

    useEffect(() => {
        const labels: string[] = [];
        if (filter.lesson_data?.title) {
            labels.push(`Pelajaran: ${filter.lesson_data.title}`);
        }
        if (filter.question_type) {
            labels.push(`Tipe Soal: ${typeOptions.find(o => o.value === filter.question_type)?.label || filter.question_type}`);
        }
        if (filter.difficulty) {
            labels.push(`Kesulitan: ${difficultyOptions.find(o => o.value === filter.difficulty)?.label || filter.difficulty}`);
        }
        setFilterLabels(labels);
    }, [filter]);

    const getDifficultyLabel = (diff: string) => difficultyOptions.find(o => o.value === diff)?.label || diff;
    const getTypeLabel = (type: string) => typeOptions.find(o => o.value === type)?.label || type;

    const gridRenderItem = (item: QuestionBankEntity, actionsNode: React.ReactNode) => {
        return (
            <article className="flex flex-col h-full hover:shadow-md transition-shadow border rounded-lg divide-y bg-card">
                <header className="p-4 flex flex-wrap gap-2 items-center justify-between">
                    <Badge variant={item.question_type === 'multiple_choice' ? 'default' : item.question_type === 'multiple_select' ? 'secondary' : 'outline'}>
                        {getTypeLabel(item.question_type ?? '')}
                    </Badge>
                    <p className={cn(
                        'text-xs font-semibold capitalize',
                        difficultyOptions.find(opt => opt.value === item.difficulty)?.color
                    )}>
                        {getDifficultyLabel(item.difficulty ?? '')}
                    </p>
                </header>
                <section className="flex-1 py-4 flex flex-col gap-4 px-4">
                    <p
                        className="text-sm leading-relaxed text-foreground whitespace-pre-wrap flex-1"
                        title={item.question_text ?? ''}
                    >
                        {item.question_text}
                    </p>

                    {item.question_options && item.question_options.length > 0 && (
                        <section className="flex flex-col gap-1 mt-2">
                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                                Pilihan Jawaban:
                            </h4>

                            <ul className="flex flex-col gap-1">
                                {item.question_options.map((opt, idx: number) => {
                                    const optText = opt.option_text ?? '';
                                    const optKey = item.question_type === 'multiple_select' ? String(idx + 1) : String.fromCharCode(65 + idx);
                                    const isCorrect = opt.is_correct === true;

                                    return (
                                        <li
                                            key={idx}
                                            className={`flex items-start gap-2 text-xs ${isCorrect
                                                    ? 'text-green-600 dark:text-green-500 font-semibold bg-green-50 dark:bg-green-950/30 rounded-sm p-1'
                                                    : 'text-muted-foreground p-1'
                                                }`}
                                        >
                                            <span className="font-bold">{optKey}.</span>
                                            <span className="line-clamp-1" title={optText}>
                                                {optText}
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
                </section>
                <section className="p-2 flex justify-end gap-2 bg-muted/20">
                    {actionsNode}
                </section>
            </article>
        );
    };

    return (
        <DataPageTemplate<QuestionBankEntity, QuestionBankCreatePayload>
            title="Bank Soal"
            description="Kelola kumpulan soal untuk tryout dan latihan."
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
                component: QuestionBankMutationForm,
                resolver: zodResolver(QuestionBankCreateSchema) as Resolver<QuestionBankCreatePayload>,
                emptyValues: {
                    lesson_id: null,
                    question_type: 'multiple_choice',
                    difficulty: 'easy',
                    question_text: '',
                    question_image_url: null,
                    explanation: null,
                    item_discrimination_a: null,
                    item_difficulty_b: null,
                    item_guessing_c: null,
                    total_tested_attempts: null,
                    last_calibrated_at: null,
                },
                defaultValues: (item) => ({
                    lesson_id: item.lesson_id ?? null,
                    question_type: item.question_type ?? 'multiple_choice',
                    difficulty: item.difficulty ?? 'easy',
                    question_text: item.question_text ?? '',
                    question_image_url: item.question_image_url ?? null,
                    explanation: item.explanation ?? null,
                    item_discrimination_a: item.item_discrimination_a ?? null,
                    item_difficulty_b: item.item_difficulty_b ?? null,
                    item_guessing_c: item.item_guessing_c ?? null,
                    total_tested_attempts: item.total_tested_attempts ?? null,
                    last_calibrated_at: item.last_calibrated_at ?? null,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Soal',
                    modalTitle: 'Tambah Soal',
                    modalSize: 'lg',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Soal — ${getTypeLabel(item.question_type ?? '')}`,
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

export default QuestionBankMainContent;
