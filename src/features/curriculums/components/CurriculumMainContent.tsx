import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useCurriculumIndex,
    useCurriculumCreate,
    useCurriculumUpdate,
    useCurriculumDelete,
    CurriculumEntity,
    CurriculumCreateSchema,
    CurriculumCreatePayload,
} from '@/services/curriculums';
import CurriculumMutationForm from './CurriculumMutationForm';

const CurriculumMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useCurriculumIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'creator',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCurriculumCreate();
    const editMutation = useCurriculumUpdate();
    const deleteMutation = useCurriculumDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Judul', key: 'title', sortable: true, render: (item: CurriculumEntity) => item.title ?? '-' },
        { title: 'Dibuat Oleh', key: 'creator', sortable: true, render: (item: CurriculumEntity) => item.creator?.name ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: CurriculumEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
        { title: 'Diperbarui Pada', key: 'updated_at', sortable: true, render: (item: CurriculumEntity) => item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<CurriculumEntity, CurriculumCreatePayload>
            title="Curriculums"
            description="Manajemen Curriculums"
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
                component: CurriculumMutationForm,
                resolver: zodResolver(CurriculumCreateSchema),
                emptyValues: {
                    tryout_id: '',
                    title: '',
                    description: '',
                    duration: 0,
                } as CurriculumCreatePayload,
                defaultValues: (item) => ({
                    tryout_id: item.tryout_id ?? '',
                    title: item.title ?? '',
                    description: item.description ?? '',
                    duration: item.duration ?? 0,
                }) as CurriculumCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah kurikulum', modalTitle: 'Tambah kurikulum', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit kurikulum', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default CurriculumMainContent;
