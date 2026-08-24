import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useLessonSectionIndex,
    useLessonSectionCreate,
    useLessonSectionUpdate,
    useLessonSectionDelete,
    LessonSectionEntity,
    LessonSectionCreateSchema,
    LessonSectionCreatePayload,
} from '@/services/lesson-sections';
import LessonSectionMutationForm from './LessonSectionMutationForm';

const LessonSectionMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useLessonSectionIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator,lesson',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useLessonSectionCreate();
    const editMutation = useLessonSectionUpdate();
    const deleteMutation = useLessonSectionDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { 
            title: 'Lesson Title', 
            key: 'lesson_title', 
            sortable: true, 
            render: (item: LessonSectionEntity) => item.lesson_title ?? '-' 
        },
        { 
            title: 'Title', 
            key: 'title', 
            sortable: true, 
            render: (item: LessonSectionEntity) => item.title ?? '-' 
        },
        { 
            title: 'Tipe', 
            key: 'type', 
            sortable: true, 
            render: (item: LessonSectionEntity) => item.type ?? '-' 
        },
        {
            title: 'Dibuat Oleh',
            key: 'creator',
            sortable: true,
            render: (item: LessonSectionEntity) => item.creator?.name || '-',
        },
        { 
            title: 'Dibuat Pada', 
            key: 'created_at', 
            sortable: true, 
            render: (item: LessonSectionEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' 
        },
        {
            title: 'Diperbarui Pada',
            key: 'updated_at',
            sortable: true,
            render: (item: LessonSectionEntity) =>
                item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-',
        },
    ], []);

    return (
        <DataPageTemplate<LessonSectionEntity, LessonSectionCreatePayload>
            title="Lesson Sections"
            description="Manajemen Lesson Sections"
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
                component: LessonSectionMutationForm,
                resolver: zodResolver(LessonSectionCreateSchema),
                emptyValues: {
                    lesson_id: '',
                    title: '',
                    content: '',
                    type: null,
                    duration: 0,
                    order: 0,
                    can_preview: false,
                } as LessonSectionCreatePayload,
                defaultValues: (item) => ({
                    lesson_id: item.lesson_id ?? '',
                    title: item.title ?? '',
                    content: item.content ?? '',
                    type: item.type ?? '',
                    duration: item.duration ?? 0,
                    order: item.order ?? 0,
                    can_preview: !!item.can_preview,
                }) as LessonSectionCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah bagian lesson', modalTitle: 'Tambah bagian lesson', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit bagian lesson', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default LessonSectionMainContent;
