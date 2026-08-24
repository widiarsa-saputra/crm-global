import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useEnrollmentIndex,
    useEnrollmentCreate,
    useEnrollmentUpdate,
    useEnrollmentDelete,
    EnrollmentEntity,
    EnrollmentCreateSchema,
    EnrollmentCreatePayload,
} from '@/services/enrollments';
import EnrollmentMutationForm from './EnrollmentMutationForm';

const EnrollmentMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useEnrollmentIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'course,student,period_enrollment,enrollment_group,curriculum',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useEnrollmentCreate();
    const editMutation = useEnrollmentUpdate();
    const deleteMutation = useEnrollmentDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Student', key: 'student', sortable: true, render: (item: EnrollmentEntity) => item.student?.name ?? item.student_id ?? '-' },
        { title: 'Course', key: 'course', sortable: true, render: (item: EnrollmentEntity) => item.course?.title ?? item.course_id ?? '-' },
        { title: 'Period', key: 'period_enrollment', sortable: true, render: (item: EnrollmentEntity) => item.period_enrollment?.id ?? item.period_enrollment_id ?? '-' },
        { title: 'Group', key: 'enrollment_group', sortable: true, render: (item: EnrollmentEntity) => item.enrollment_group?.name ?? item.enrollment_group_id ?? '-' },
        { title: 'Curriculum', key: 'curriculum', sortable: true, render: (item: EnrollmentEntity) => item.curriculum?.title ?? item.curriculum_id ?? '-' },
        { title: 'Status', key: 'status', sortable: true, render: (item: EnrollmentEntity) => item.status ?? '-' },
        { title: 'Type', key: 'type', sortable: true, render: (item: EnrollmentEntity) => item.type ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: EnrollmentEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
        { title: 'Diperbarui Pada', key: 'updated_at', sortable: true, render: (item: EnrollmentEntity) => item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<EnrollmentEntity, EnrollmentCreatePayload>
            title="Enrollments"
            description="Manajemen Enrollments"
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
                component: EnrollmentMutationForm,
                resolver: zodResolver(EnrollmentCreateSchema),
                emptyValues: {
                    course_id: '',
                    student_id: '',
                    period_enrollment_id: '',
                    enrollment_group_id: '',
                    curriculum_id: '',
                    total_sessions: 0,
                    status: '',
                    reason: '',
                    type: 'private',
                } as EnrollmentCreatePayload,
                defaultValues: (item) => ({
                    course_id: item.course_id ?? '',
                    student_id: item.student_id ?? '',
                    period_enrollment_id: item.period_enrollment_id ?? '',
                    enrollment_group_id: item.enrollment_group_id ?? '',
                    curriculum_id: item.curriculum_id ?? '',
                    total_sessions: item.total_sessions ?? 0,
                    status: item.status ?? '',
                    reason: item.reason ?? '',
                    type: item.type ?? 'private',
                }) as EnrollmentCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default EnrollmentMainContent;
