import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    usePeriodEnrollmentIndex,
    usePeriodEnrollmentCreate,
    usePeriodEnrollmentUpdate,
    usePeriodEnrollmentDelete,
    PeriodEnrollmentEntity,
    PeriodEnrollmentCreateSchema,
    PeriodEnrollmentCreatePayload,
} from '@/services/period-enrollments';
import PeriodEnrollmentMutationForm from './PeriodEnrollmentMutationForm';

const PeriodEnrollmentMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = usePeriodEnrollmentIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator,period,student,curriculum',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = usePeriodEnrollmentCreate();
    const editMutation = usePeriodEnrollmentUpdate();
    const deleteMutation = usePeriodEnrollmentDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Period', key: 'period', sortable: true, render: (item: PeriodEnrollmentEntity) => item.period?.title ?? item.period_title ?? '-' },
        { title: 'Student', key: 'student', sortable: true, render: (item: PeriodEnrollmentEntity) => item.student?.name ?? item.student_name ?? '-' },
        { title: 'Curriculum', key: 'curriculum', sortable: true, render: (item: PeriodEnrollmentEntity) => item.curriculum?.title ?? item.curriculum_title ?? '-' },
        { title: 'Dibuat Oleh', key: 'creator', sortable: true, render: (item: PeriodEnrollmentEntity) => item.creator?.name ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: PeriodEnrollmentEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
        { title: 'Diperbarui Pada', key: 'updated_at', sortable: true, render: (item: PeriodEnrollmentEntity) => item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<PeriodEnrollmentEntity, PeriodEnrollmentCreatePayload>
            title="Period Enrollments"
            description="Manajemen Period Enrollments"
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
                component: PeriodEnrollmentMutationForm,
                resolver: zodResolver(PeriodEnrollmentCreateSchema),
                emptyValues: {
                    period_id: '',
                    student_id: '',
                    curriculum_id: '',
                } as PeriodEnrollmentCreatePayload,
                defaultValues: (item) => ({
                    period_id: item.period_id ?? '',
                    student_id: item.student_id ?? '',
                    curriculum_id: item.curriculum_id ?? '',
                }) as PeriodEnrollmentCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default PeriodEnrollmentMainContent;
