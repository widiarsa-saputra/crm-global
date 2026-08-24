import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useTryoutAttemptIndex,
    useTryoutAttemptCreate,
    useTryoutAttemptUpdate,
    useTryoutAttemptDelete,
    TryoutAttemptEntity,
    TryoutAttemptCreateSchema,
    TryoutAttemptCreatePayload,
} from '@/services/tryout-attempts';
import { TryoutAttemptMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import { useTryoutIndex, TryoutEntity } from '@/services/tryouts';
import { useStudentIndex, StudentEntity } from '@/services/students';
import LabelComp from '@/components/LabelComp';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import NativeSelect from '@/shared/components/form/NativeSelect';

const TryoutAttemptMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const initialFilterState: {
        tryout_id: string | undefined;
        tryout_data: TryoutEntity | undefined;
        student_id: string | undefined;
        student_data: StudentEntity | undefined;
        status: string | undefined;
    } = {
        tryout_id: undefined,
        tryout_data: undefined,
        student_id: undefined,
        student_data: undefined,
        status: undefined,
    };
    const [filter, setFilter] = useState(initialFilterState);
    const [tempFilter, setTempFilter] = useState(initialFilterState);
    const [filterLabels, setFilterLabels] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [tryoutSearch, setTryoutSearch] = useState('');
    const debouncedTryoutSearch = useDebounce(tryoutSearch, 500);

    const [studentSearch, setStudentSearch] = useState('');
    const debouncedStudentSearch = useDebounce(studentSearch, 500);

    const { data: tryoutData, isLoading: isLoadingTryout } = useTryoutIndex({
        search: debouncedTryoutSearch,
        paginate: 30,
    });

    const { data: studentData, isLoading: isLoadingStudent } = useStudentIndex({
        search: debouncedStudentSearch,
        paginate: 30,
    });

    const tryoutOptions = (tryoutData?.data ?? []).map(tryout => ({
        label: tryout.title ?? '',
        value: String(tryout.id),
        data: tryout,
    }));

    const studentOptions = (studentData?.data ?? []).map(student => ({
        label: student.name ?? '',
        value: String(student.id),
        data: student,
    }));

    const statusOptions = [
        { label: 'Semua Status', value: '' },
        { label: 'Sedang Dikerjakan', value: 'in_progress' },
        { label: 'Dijeda', value: 'paused' },
        { label: 'Selesai', value: 'completed' },
        { label: 'Sudah Dinilai', value: 'graded' },
    ];

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari data attempt...',
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
                        <LabelComp>Siswa</LabelComp>
                        <SearchableSelect
                            options={studentOptions}
                            value={tempFilter.student_id || ''}
                            onChange={(val) => {
                                const valStr = val as string;
                                let studentData = undefined;
                                if (valStr) {
                                    const selectedOpt = studentOptions.find(opt => opt.value === valStr);
                                    if (selectedOpt && selectedOpt.data) {
                                        studentData = selectedOpt.data;
                                    }
                                }
                                setTempFilter(prev => ({ ...prev, student_id: valStr || undefined, student_data: studentData }));
                            }}
                            placeholder="Semua Siswa"
                            serverSideSearch
                            searchValue={studentSearch}
                            onSearchChange={setStudentSearch}
                            isPending={isLoadingStudent}
                        />
                    </div>
                    <div>
                        <LabelComp>Status</LabelComp>
                        <NativeSelect
                            options={statusOptions}
                            value={tempFilter.status || ''}
                            onChange={(e) => setTempFilter({ ...tempFilter, status: e.target.value || undefined })}
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
    }), [search, tempFilter, tryoutOptions, tryoutSearch, isLoadingTryout, studentOptions, studentSearch, isLoadingStudent]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutAttemptIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        filter: {
            tryout_id: filter.tryout_id,
            student_id: filter.student_id,
            status: filter.status,
        },
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTryoutAttemptCreate();
    const editMutation = useTryoutAttemptUpdate();
    const deleteMutation = useTryoutAttemptDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, filter, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'ID Tryout',
            key: 'tryout_id',
            sortable: true,
            render: (item: TryoutAttemptEntity) => <span className="font-semibold">{item.tryout_id}</span>,
        },
        {
            title: 'ID Siswa',
            key: 'student_id',
            sortable: true,
        },
        {
            title: 'Status',
            key: 'status',
            sortable: true,
            render: (item: TryoutAttemptEntity) => {
                const map: Record<string, { label: string; color: string }> = {
                    in_progress: { label: 'Sedang Dikerjakan', color: 'bg-blue-100 text-blue-700' },
                    paused:      { label: 'Dijeda',            color: 'bg-yellow-100 text-yellow-700' },
                    completed:   { label: 'Selesai',           color: 'bg-green-100 text-green-700' },
                    graded:      { label: 'Sudah Dinilai',     color: 'bg-purple-100 text-purple-700' },
                };
                const s = map[item.status ?? ''];
                if (!s) return item.status;
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                        {s.label}
                    </span>
                );
            },
        },
        {
            title: 'Nilai Akhir',
            key: 'total_score',
            sortable: true,
            render: (item: TryoutAttemptEntity) => item.total_score != null ? item.total_score : '-',
        },
        {
            title: 'Waktu Submit',
            key: 'submitted_at',
            sortable: true,
            render: (item: TryoutAttemptEntity) =>
                item.submitted_at ? new Date(item.submitted_at).toLocaleString('id-ID') : '-',
        },
    ], []);

    useEffect(() => {
        const labels: string[] = [];
        if (filter.tryout_data?.title) {
            labels.push(`Tryout: ${filter.tryout_data.title}`);
        }
        if (filter.student_data?.name) {
            labels.push(`Siswa: ${filter.student_data.name}`);
        }
        if (filter.status) {
            labels.push(`Status: ${statusOptions.find(o => o.value === filter.status)?.label || filter.status}`);
        }
        setFilterLabels(labels);
    }, [filter]);

    return (
        <DataPageTemplate<TryoutAttemptEntity, TryoutAttemptCreatePayload>
            title="Hasil Tryout"
            description="Kelola data hasil percobaan tryout siswa."
            columns={columns}
            data={displayItems}
            isLoading={isLoading}
            filterLabels={filterLabels}
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
            mutationMode="content"
            mutationForm={{
                component: TryoutAttemptMutationForm,
                resolver: zodResolver(TryoutAttemptCreateSchema) as Resolver<TryoutAttemptCreatePayload>,
                emptyValues: {
                    tryout_id: null,
                    student_id: null,
                    status: 'in_progress',
                },
                defaultValues: (item) => ({
                    tryout_id: item.tryout_id ?? null,
                    student_id: item.student_id ?? null,
                    status: item.status ?? 'in_progress',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Attempt',
                    modalTitle: 'Tambah Attempt',
                    modalDescription: 'Isi form berikut untuk menambahkan data attempt.',
                    modalSize: 'lg',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Attempt — ${item.student_id}`,
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

export default TryoutAttemptMainContent;
