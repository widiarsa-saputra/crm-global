import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useTryoutIndex,
    useTryoutCreate,
    useTryoutUpdate,
    useTryoutDelete,
    TryoutEntity,
    TryoutCreateSchema,
    TryoutCreatePayload,
} from '@/services/tryouts';
import { TryoutMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import LabelComp from '@/components/LabelComp';
import NativeSelect from '@/shared/components/form/NativeSelect';

const TryoutMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const initialFilterState: {
        is_published: string | undefined;
        is_active: string | undefined;
    } = {
        is_published: undefined,
        is_active: undefined,
    };
    const [filter, setFilter] = useState(initialFilterState);
    const [tempFilter, setTempFilter] = useState(initialFilterState);
    const [filterLabels, setFilterLabels] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const statusOptions = [
        { label: 'Semua Status Publikasi', value: '' },
        { label: 'Published', value: '1' },
        { label: 'Draft', value: '0' },
    ];

    const activeOptions = [
        { label: 'Semua Status Aktif', value: '' },
        { label: 'Aktif', value: '1' },
        { label: 'Tidak Aktif', value: '0' },
    ];

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari tryout...',
            value: search,
            onChange: setSearch,
        },
        filter: {
            content: (
                <div className="flex flex-col gap-4">
                    <div>
                        <LabelComp>Publikasi</LabelComp>
                        <NativeSelect
                            options={statusOptions}
                            value={tempFilter.is_published || ''}
                            onChange={(e) => setTempFilter({ ...tempFilter, is_published: e.target.value || undefined })}
                        />
                    </div>
                    <div>
                        <LabelComp>Status Aktif</LabelComp>
                        <NativeSelect
                            options={activeOptions}
                            value={tempFilter.is_active || ''}
                            onChange={(e) => setTempFilter({ ...tempFilter, is_active: e.target.value || undefined })}
                        />
                    </div>
                </div>
            ),
            onClear: () => {
                setFilter(initialFilterState);
                setTempFilter(initialFilterState);
            },
            onApply: () => {
                setFilter(tempFilter);
            },
        },
    }), [search, tempFilter]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTryoutIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        filter: {
            is_published: filter.is_published,
            is_active: filter.is_active,
        },
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTryoutCreate();
    const editMutation = useTryoutUpdate();
    const deleteMutation = useTryoutDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, filter, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Judul',
            key: 'title',
            sortable: true,
            render: (item: TryoutEntity) => <span className="font-semibold">{item.title}</span>,
        },
        {
            title: 'Status Aktif',
            key: 'is_active',
            sortable: true,
            render: (item: TryoutEntity) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
            ),
        },
        {
            title: 'Publikasi',
            key: 'is_published',
            sortable: true,
            render: (item: TryoutEntity) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                </span>
            ),
        },
        {
            title: 'Max Attempts',
            key: 'default_max_attempts',
            sortable: true,
            render: (item: TryoutEntity) => item.default_max_attempts != null ? item.default_max_attempts : 'Unlimited',
        },
    ], []);

    useEffect(() => {
        const labels: string[] = [];
        if (filter.is_published) {
            labels.push(`Publikasi: ${statusOptions.find(o => o.value === filter.is_published)?.label || filter.is_published}`);
        }
        if (filter.is_active) {
            labels.push(`Status Aktif: ${activeOptions.find(o => o.value === filter.is_active)?.label || filter.is_active}`);
        }
        setFilterLabels(labels);
    }, [filter]);

    return (
        <DataPageTemplate<TryoutEntity, TryoutCreatePayload>
            title="Daftar Tryout"
            description="Kelola data tryout dan ujian simulasi."
            columns={columns}
            data={displayItems}
            isLoading={isLoading}
            filterLabels={filterLabels}
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
            mutationMode="content"
            mutationForm={{
                component: TryoutMutationForm,
                resolver: zodResolver(TryoutCreateSchema) as Resolver<TryoutCreatePayload>,
                emptyValues: {
                    title: '',
                    description: null,
                    is_active: false,
                    default_max_attempts: null,
                    is_published: false,
                },
                defaultValues: (item) => ({
                    title: item.title ?? '',
                    description: item.description ?? null,
                    is_active: item.is_active ?? false,
                    default_max_attempts: item.default_max_attempts ?? null,
                    is_published: item.is_published ?? false,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Tryout',
                    modalTitle: 'Tambah Tryout',
                    modalDescription: 'Isi form berikut untuk menambahkan tryout baru.',
                    modalSize: 'lg',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Tryout — ${item.title}`,
                    modalSize: 'lg',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
        />
    );
};

export default TryoutMainContent;
