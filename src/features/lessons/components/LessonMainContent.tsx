import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useLessonIndex,
    useLessonCreate,
    useLessonUpdate,
    useLessonDelete,
    LessonEntity,
    LessonCreateSchema,
    LessonCreatePayload,
} from '@/services/lessons';
import LessonMutationForm from './LessonMutationForm';

const LessonMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useLessonIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator,course_section',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useLessonCreate();
    const editMutation = useLessonUpdate();
    const deleteMutation = useLessonDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { 
            title: 'Course Section', 
            key: 'course_section_title', 
            sortable: true, 
            render: (item: LessonEntity) => item.course_section_title ?? '-' 
        },
        { 
            title: 'Title', 
            key: 'title', 
            sortable: true, 
            render: (item: LessonEntity) => item.title ?? '-' 
        },
        {
            title: 'Dibuat Oleh',
            key: 'creator',
            sortable: true,
            render: (item: LessonEntity) => item.creator?.name || '-',
        },
        { 
            title: 'Dibuat Pada', 
            key: 'created_at', 
            sortable: true, 
            render: (item: LessonEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' 
        },
        {
            title: 'Diperbarui Pada',
            key: 'updated_at',
            sortable: true,
            render: (item: LessonEntity) =>
                item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-',
        },
    ], []);

    return (
        <DataPageTemplate<LessonEntity, LessonCreatePayload>
            title="Lessons"
            description="Manajemen Lessons"
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
                component: LessonMutationForm,
                resolver: zodResolver(LessonCreateSchema),
                emptyValues: {
                    course_section_id: '',
                    title: '',
                    order: 0,
                    duration: 0,
                } as LessonCreatePayload,
                defaultValues: (item) => ({
                    course_section_id: item.course_section_id ?? '',
                    title: item.title ?? '',
                    order: item.order ?? 0,
                    duration: item.duration ?? 0,
                }) as LessonCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah lesson', modalTitle: 'Tambah lesson', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit lesson', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default LessonMainContent;
