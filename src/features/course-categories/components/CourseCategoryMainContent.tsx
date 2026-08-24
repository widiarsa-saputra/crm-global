import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useCourseCategoryIndex,
    useCourseCategoryCreate,
    useCourseCategoryUpdate,
    useCourseCategoryDelete,
    CourseCategoryEntity,
    CourseCategoryCreateSchema,
    CourseCategoryCreatePayload,
} from '@/services/course-categories';
import { CourseCategoryMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';

const CourseCategoryMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const topbarConfig = useMemo(() => ({
        search: {
            value: search,
            onChange: setSearch,
            placeholder: 'Cari kategori kursus...',
        },
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useCourseCategoryIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCourseCategoryCreate();
    const editMutation = useCourseCategoryUpdate();
    const deleteMutation = useCourseCategoryDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Nama Kategori',
            key: 'name',
            sortable: true,
            expand: true,
            render: (item: CourseCategoryEntity) => <span className='font-semibold'>{item.name}</span>
        },

        {
            title: 'Total Kursus',
            key: 'total_course',
            sortable: true,
            render: (item: CourseCategoryEntity) => item.total_course ?? 0,
        },
        {
            title: 'Dibuat Oleh',
            key: 'creator',
            sortable: true,
            render: (item: CourseCategoryEntity) => item.creator?.name || '-',
        },
        {
            title: 'Dibuat Pada',
            key: 'created_at',
            sortable: true,
            render: (item: CourseCategoryEntity) =>
                item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-',
        },
        {
            title: 'Diperbarui Pada',
            key: 'updated_at',
            sortable: true,
            render: (item: CourseCategoryEntity) =>
                item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-',
        },
    ], []);

    return (
        <DataPageTemplate<CourseCategoryEntity, CourseCategoryCreatePayload>
            title="Kategori Kursus"
            description="Kelola kategori untuk pengelompokan kursus."
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
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationMode="modal"
            mutationForm={{
                component: CourseCategoryMutationForm,
                resolver: zodResolver(CourseCategoryCreateSchema),
                emptyValues: {
                    parent_id: null,
                    name: '',
                    description: '',
                    is_active: true,
                },
                defaultValues: (item) => ({
                    parent_id: item.parent_id ?? null,
                    name: item.name ?? '',
                    description: item.description ?? '',
                    is_active: item.is_active ?? true,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Kategori Kursus',
                    modalTitle: 'Tambah Kategori Kursus',
                    modalDescription: 'Isi form berikut untuk menambahkan kategori kursus baru.',
                    modalSize: 'md',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Kategori — ${item.name}`,
                    modalDescription: 'Perbarui informasi kategori kursus di bawah ini.',
                    modalSize: 'md',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
        />
    );
};

export default CourseCategoryMainContent;
