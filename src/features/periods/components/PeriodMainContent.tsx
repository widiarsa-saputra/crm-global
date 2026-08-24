import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    usePeriodIndex,
    usePeriodCreate,
    usePeriodUpdate,
    usePeriodDelete,
    PeriodEntity,
    PeriodCreateSchema,
    PeriodCreatePayload,
} from '@/services/periods';
import PeriodMutationForm from './PeriodMutationForm';

const PeriodMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = usePeriodIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'course,curriculum,tutor',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = usePeriodCreate();
    const editMutation = usePeriodUpdate();
    const deleteMutation = usePeriodDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Judul', key: 'title', sortable: true, render: (item: PeriodEntity) => item.title ?? '-' },
        { title: 'Course', key: 'course_title', sortable: true, render: (item: PeriodEntity) => item.course_name ?? item.course?.title ?? '-' },
        { title: 'Curriculum', key: 'curriculum_title', sortable: true, render: (item: PeriodEntity) => item.curriculum_title ?? item.curriculum?.title ?? '-' },
        { title: 'Tutor', key: 'tutor_name', sortable: true, render: (item: PeriodEntity) => item.tutor_name ?? item.tutor?.name ?? '-' },
        { title: 'Mulai', key: 'start_date', sortable: true, render: (item: PeriodEntity) => item.start_date ? new Date(item.start_date).toLocaleDateString('id-ID') : '-' },
        { title: 'Selesai', key: 'end_date', sortable: true, render: (item: PeriodEntity) => item.end_date ? new Date(item.end_date).toLocaleDateString('id-ID') : '-' },
        { title: 'Kapasitas', key: 'max_capacity', sortable: true, render: (item: PeriodEntity) => item.max_capacity ?? '-' },
        { title: 'Sertifikat', key: 'has_certificate', sortable: true, render: (item: PeriodEntity) => item.has_certificate ? 'Ya' : 'Tidak' },
        { title: 'Status', key: 'status', sortable: true, render: (item: PeriodEntity) => item.status ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: PeriodEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<PeriodEntity, PeriodCreatePayload>
            title="Periods"
            description="Manajemen Periods"
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
            handleSort={(newSortBy, newSortOrder) => { setSortBy(newSortBy); setSortOrder(newSortOrder); }}
            mutationMode="modal"
            mutationForm={{
                component: PeriodMutationForm,
                resolver: zodResolver(PeriodCreateSchema),
                emptyValues: {
                    title: '',
                    course_id: '',
                    curriculum_id: '',
                    tutor_id: '',
                    start_date: '',
                    end_date: '',
                    max_capacity: 0,
                    status: null,
                    has_certificate: false,
                } as PeriodCreatePayload,
                defaultValues: (item) => ({
                    title: item.title ?? '',
                    course_id: item.course_id ?? '',
                    curriculum_id: item.curriculum_id ?? '',
                    tutor_id: item.tutor_id ?? '',
                    start_date: item.start_date ?? '',
                    end_date: item.end_date ?? '',
                    max_capacity: item.max_capacity ?? 0,
                    status: item.status ?? '',
                    has_certificate: !!item.has_certificate,
                }) as PeriodCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default PeriodMainContent;
