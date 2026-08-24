import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useTutoringSessionIndex,
    useTutoringSessionCreate,
    useTutoringSessionUpdate,
    useTutoringSessionDelete,
    TutoringSessionEntity,
    TutoringSessionCreateSchema,
    TutoringSessionCreatePayload,
} from '@/services/tutoring-sessions';
import TutoringSessionMutationForm from './TutoringSessionMutationForm';

const TutoringSessionMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useTutoringSessionIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'enrollment_group,enrollment,tutor',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTutoringSessionCreate();
    const editMutation = useTutoringSessionUpdate();
    const deleteMutation = useTutoringSessionDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Group', key: 'enrollment_group', sortable: true, render: (item: TutoringSessionEntity) => item.enrollment_group_name ?? item.enrollment_group?.name ?? '-' },
        { title: 'Enrollment', key: 'enrollment', sortable: true, render: (item: TutoringSessionEntity) => item.enrollment_student_name ?? item.enrollment?.student?.name ?? '-' },
        { title: 'Tutor', key: 'tutor', sortable: true, render: (item: TutoringSessionEntity) => item.tutor_name ?? item.tutor?.name ?? '-' },
        { title: 'Start Time', key: 'start_time', sortable: true, render: (item: TutoringSessionEntity) => item.start_time ? new Date(item.start_time).toLocaleString('id-ID') : '-' },
        { title: 'Status', key: 'status', sortable: true, render: (item: TutoringSessionEntity) => item.status ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: TutoringSessionEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
        { title: 'Diperbarui Pada', key: 'updated_at', sortable: true, render: (item: TutoringSessionEntity) => item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<TutoringSessionEntity, TutoringSessionCreatePayload>
            title="Tutoring Sessions"
            description="Manajemen Tutoring Sessions"
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
                component: TutoringSessionMutationForm,
                resolver: zodResolver(TutoringSessionCreateSchema),
                emptyValues: {
                    enrollment_group_id: '',
                    enrollment_id: '',
                    tutor_id: '',
                    start_time: '',
                    duration: 0,
                    estimated_complete_time: '',
                    results: '',
                    status: 'pending',
                } as TutoringSessionCreatePayload,
                defaultValues: (item) => ({
                    enrollment_group_id: item.enrollment_group_id ?? '',
                    enrollment_id: item.enrollment_id ?? '',
                    tutor_id: item.tutor_id ?? '',
                    start_time: item.start_time ?? '',
                    duration: item.duration ?? 0,
                    estimated_complete_time: item.estimated_complete_time ?? '',
                    results: item.results ?? '',
                    status: item.status ?? 'pending',
                }) as TutoringSessionCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default TutoringSessionMainContent;
