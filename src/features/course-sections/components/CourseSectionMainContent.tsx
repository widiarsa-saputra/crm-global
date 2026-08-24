import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useCourseSectionIndex,
    useCourseSectionCreate,
    useCourseSectionUpdate,
    useCourseSectionDelete,
    CourseSectionEntity,
    CourseSectionCreateSchema,
    CourseSectionCreatePayload,
} from '@/services/course-sections';
import CourseSectionMutationForm from './CourseSectionMutationForm';

const CourseSectionMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useCourseSectionIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator,course',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCourseSectionCreate();
    const editMutation = useCourseSectionUpdate();
    const deleteMutation = useCourseSectionDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { 
            title: 'Course', 
            key: 'course_title', 
            sortable: true, 
            render: (item: CourseSectionEntity) => item.course_title ?? '-' 
        },
        { 
            title: 'Title', 
            key: 'title', 
            sortable: true, 
            render: (item: CourseSectionEntity) => item.title ?? '-' 
        },
        {
            title: 'Dibuat Oleh',
            key: 'creator',
            sortable: true,
            render: (item: CourseSectionEntity) => item.creator?.name || '-',
        },
        { 
            title: 'Dibuat Pada', 
            key: 'created_at', 
            sortable: true, 
            render: (item: CourseSectionEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' 
        },
        {
            title: 'Diperbarui Pada',
            key: 'updated_at',
            sortable: true,
            render: (item: CourseSectionEntity) =>
                item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-',
        },
    ], []);

    return (
        <DataPageTemplate<CourseSectionEntity, CourseSectionCreatePayload>
            title="Course Sections"
            description="Manajemen Course Sections"
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
                component: CourseSectionMutationForm,
                resolver: zodResolver(CourseSectionCreateSchema),
                emptyValues: {
                    course_id: '',
                    title: '',
                    order: 0,
                } as CourseSectionCreatePayload,
                defaultValues: (item) => ({
                    course_id: item.course_id ?? '',
                    title: item.title ?? '',
                    order: item.order ?? 0,
                }) as CourseSectionCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah section', modalTitle: 'Tambah section', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit section', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default CourseSectionMainContent;
