import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useCurriculumCourseIndex,
    useCurriculumCourseCreate,
    useCurriculumCourseUpdate,
    useCurriculumCourseDelete,
    CurriculumCourseEntity,
    CurriculumCourseCreateSchema,
    CurriculumCourseCreatePayload,
} from '@/services/curriculum-courses';
import CurriculumCourseMutationForm from './CurriculumCourseMutationForm';

const CurriculumCourseMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useCurriculumCourseIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator,course,curriculum',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCurriculumCourseCreate();
    const editMutation = useCurriculumCourseUpdate();
    const deleteMutation = useCurriculumCourseDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Course', key: 'course_title', sortable: true, render: (item: CurriculumCourseEntity) => item.course_name ?? item.course?.title ?? '-' },
        { title: 'Curriculum', key: 'curriculum_title', sortable: true, render: (item: CurriculumCourseEntity) => item.curriculum_title ?? item.curriculum?.title ?? '-' },
        { title: 'Dibuat Oleh', key: 'creator', sortable: true, render: (item: CurriculumCourseEntity) => item.creator?.name ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: CurriculumCourseEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
        { title: 'Diperbarui Pada', key: 'updated_at', sortable: true, render: (item: CurriculumCourseEntity) => item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<CurriculumCourseEntity, CurriculumCourseCreatePayload>
            title="Curriculum Courses"
            description="Manajemen Curriculum Courses"
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
                component: CurriculumCourseMutationForm,
                resolver: zodResolver(CurriculumCourseCreateSchema),
                emptyValues: {
                    course_id: '',
                    curriculum_id: '',
                } as CurriculumCourseCreatePayload,
                defaultValues: (item) => ({
                    course_id: item.course_id ?? '',
                    curriculum_id: item.curriculum_id ?? '',
                }) as CurriculumCourseCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default CurriculumCourseMainContent;
