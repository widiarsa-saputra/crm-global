import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useAssignTryoutIndex,
    useAssignTryoutCreate,
    useAssignTryoutUpdate,
    useAssignTryoutDelete,
    AssignTryoutEntity,
    AssignTryoutCreateSchema,
    AssignTryoutCreatePayload,
} from '@/services/assign-tryouts';
import AssignTryoutMutationForm from './AssignTryoutMutationForm';

const AssignTryoutMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useAssignTryoutIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'course,period,tryout,lesson',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useAssignTryoutCreate();
    const editMutation = useAssignTryoutUpdate();
    const deleteMutation = useAssignTryoutDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Course', key: 'course', sortable: true, render: (item: AssignTryoutEntity) => item.course_name ?? item.course?.title ?? '-' },
        { title: 'Period', key: 'period', sortable: true, render: (item: AssignTryoutEntity) => item.period_title ?? item.period?.title ?? '-' },
        { title: 'Tryout', key: 'tryout', sortable: true, render: (item: AssignTryoutEntity) => item.tryout_title ?? item.tryout?.title ?? '-' },
        { title: 'Lesson', key: 'lesson', sortable: true, render: (item: AssignTryoutEntity) => item.lesson_title ?? item.lesson?.title ?? '-' },
        { title: 'Start Time', key: 'start_time', sortable: true, render: (item: AssignTryoutEntity) => item.start_time ? new Date(item.start_time).toLocaleString('id-ID') : '-' },
        { title: 'Deadline', key: 'deadline_time', sortable: true, render: (item: AssignTryoutEntity) => item.deadline_time ? new Date(item.deadline_time).toLocaleString('id-ID') : '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: AssignTryoutEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<AssignTryoutEntity, AssignTryoutCreatePayload>
            title="Assign Tryouts"
            description="Manajemen Assign Tryouts"
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
                component: AssignTryoutMutationForm,
                resolver: zodResolver(AssignTryoutCreateSchema),
                emptyValues: {
                    course_id: '',
                    period_id: '',
                    tryout_id: '',
                    lesson_id: '',
                    start_time: '',
                    deadline_time: '',
                    max_attempts: 0,
                    order: 0,
                } as AssignTryoutCreatePayload,
                defaultValues: (item) => ({
                    course_id: item.course_id ?? '',
                    period_id: item.period_id ?? '',
                    tryout_id: item.tryout_id ?? '',
                    lesson_id: item.lesson_id ?? '',
                    start_time: item.start_time ?? '',
                    deadline_time: item.deadline_time ?? '',
                    max_attempts: item.max_attempts ?? 0,
                    order: item.order ?? 0,
                }) as AssignTryoutCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah afiliasi tryout', modalTitle: 'Tambah afiliasi tryout', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit afiliasi tryout', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default AssignTryoutMainContent;
