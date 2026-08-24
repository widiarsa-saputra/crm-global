import React, { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import {
    useClassIndex,
    useClassCreate,
    useClassUpdate,
    useClassDelete,
    ClassEntity,
    ClassCreateSchema,
    ClassCreatePayload,
} from '@/services/classes';
import { ClassMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { RadioItemList } from '@/shared/components/form/RadioItemList';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const ClassMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [status, setStatus] = useState<string>('all');

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari kelas...',
            value: search,
            onChange: setSearch,
        },
        filter: {
            content: (
                <div className="p-4 w-64">
                    <h4 className="font-medium mb-3">Status Kelas</h4>
                    <RadioItemList
                        data={[
                            { id: 'all', name: 'Semua Status' },
                            { id: 'active', name: 'Aktif' },
                            { id: 'inactive', name: 'Tidak Aktif' },
                        ]}
                        selectedKey={status}
                        onChange={setStatus}
                        keySelector={(item) => item.id}
                        labelSelector={(item) => item.name}
                    />
                </div>
            ),
            onClear: () => setStatus('all'),
        },
    }), [search, status]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useClassIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        is_active: status === 'all' ? undefined : status,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useClassCreate();
    const editMutation = useClassUpdate();
    const deleteMutation = useClassDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, status, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Nama Kelas',
            key: 'name',
            sortable: true,
            render: (item: ClassEntity) => <span className="font-semibold">{item.name}</span>,
        },
        {
            title: 'Status',
            key: 'is_active',
            sortable: true,
            render: (item: ClassEntity) => {
                const isActive = item.is_active === 'active';
                return (
                    <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={isActive ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                        {isActive ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                );
            },
        },
        {
            title: 'Dibuat Pada',
            key: 'created_at',
            sortable: true,
            render: (item: ClassEntity) => (
                <span className="text-sm">
                    {item.created_at
                        ? format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: id })
                        : '-'}
                </span>
            ),
        },
        {
            title: 'Diperbarui Pada',
            key: 'updated_at',
            sortable: true,
            render: (item: ClassEntity) => (
                <span className="text-sm">
                    {item.updated_at
                        ? format(new Date(item.updated_at), 'dd MMM yyyy, HH:mm', { locale: id })
                        : '-'}
                </span>
            ),
        },
    ], []);

    return (
        <DataPageTemplate<ClassEntity, ClassCreatePayload>
            title="Daftar Kelas"
            description="Kelola data kelas master."
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
                component: ClassMutationForm,
                resolver: zodResolver(ClassCreateSchema) as Resolver<ClassCreatePayload>,
                emptyValues: {
                    name: '',
                    is_active: 'active',
                },
                defaultValues: (item) => ({
                    name: item.name ?? '',
                    is_active: item.is_active ?? 'active',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Kelas',
                    modalTitle: 'Tambah Kelas',
                    modalDescription: 'Isi form berikut untuk menambahkan kelas baru.',
                    modalSize: 'sm',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (item) => `Edit Kelas — ${item.name}`,
                    modalSize: 'sm',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
        />
    );
};

export default ClassMainContent;
