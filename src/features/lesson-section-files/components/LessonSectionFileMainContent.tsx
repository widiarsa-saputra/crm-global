import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useLessonSectionFileIndex,
    useLessonSectionFileCreate,
    useLessonSectionFileUpdate,
    useLessonSectionFileDelete,
    LessonSectionFileEntity,
    LessonSectionFileCreateSchema,
    LessonSectionFileCreatePayload,
} from '@/services/lesson-section-files';
import LessonSectionFileMutationForm from './LessonSectionFileMutationForm';

const LessonSectionFileMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useLessonSectionFileIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useLessonSectionFileCreate();
    const editMutation = useLessonSectionFileUpdate();
    const deleteMutation = useLessonSectionFileDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'ID', key: 'id', sortable: true, render: (item: LessonSectionFileEntity) => item.id },
        { title: 'Lesson Section ID', key: 'lesson_section_id', sortable: true, render: (item: LessonSectionFileEntity) => item.lesson_section_id ?? '-' },
        { title: 'File', key: 'file', sortable: false, render: (item: LessonSectionFileEntity) => item.file?.name ?? '-' },
        {
            title: 'Dibuat Oleh',
            key: 'creator',
            sortable: true,
            render: (item: LessonSectionFileEntity) => item.creator?.name || '-',
        },
        { 
            title: 'Dibuat Pada', 
            key: 'created_at', 
            sortable: true, 
            render: (item: LessonSectionFileEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' 
        },
        {
            title: 'Diperbarui Pada',
            key: 'updated_at',
            sortable: true,
            render: (item: LessonSectionFileEntity) =>
                item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-',
        },
    ], []);

    return (
        <DataPageTemplate<LessonSectionFileEntity, LessonSectionFileCreatePayload>
            title="Lesson Section Files"
            description="Manajemen Lesson Section Files"
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
                component: LessonSectionFileMutationForm,
                resolver: zodResolver(LessonSectionFileCreateSchema),
                emptyValues: {
                    lesson_section_id: '',
                    file_id: '',
                } as LessonSectionFileCreatePayload,
                defaultValues: (item) => ({
                    lesson_section_id: item.lesson_section_id ?? '',
                    file_id: item.file_id ?? '',
                }) as LessonSectionFileCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah file lesson section', modalTitle: 'Tambah file lesson section', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit file lesson section', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default LessonSectionFileMainContent;
