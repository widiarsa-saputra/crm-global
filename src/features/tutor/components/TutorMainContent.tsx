import React, { useState, useMemo, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useTutorIndex,
    useTutorCreate,
    useTutorUpdate,
    useTutorDelete,
    TutorEntity,
    TutorCreateSchema,
    TutorCreatePayload,
} from '../../../services/tutors';
import { TutorMutationForm } from '.';
import { Copy } from 'lucide-react';
import { onCopy } from '@/lib/utils';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';

const TutorMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const topbarConfig = useMemo(() => ({
        search: {
            value: search,
            onChange: setSearch,
            placeholder: 'Cari tutor...'
        }
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useTutorIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useTutorCreate();
    const editMutation = useTutorUpdate();
    const deleteMutation = useTutorDelete();

    const displayTutors = useMemo(() => {
        return response?.data || [];
    }, [response?.data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Nama Tutor',
            key: 'name',
            sortable: true,
            render: (tutor: TutorEntity) => <span className="font-semibold">{tutor.name}</span>,
        },
        {
            title: 'Email',
            key: 'email',
            sortable: true,
            render: (tutor: TutorEntity) => <span className="italic">{tutor.email || '-'}</span>,
        },
        {
            title: 'No. Telepon',
            key: 'phone',
            sortable: true,
            render: (tutor: TutorEntity) => (
                <div className="flex items-center gap-4 group">
                    <span className="text-blue-500">{tutor.phone || '-'}</span>
                    <button
                        className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500"
                        title="Copy No. Telepon"
                        onClick={() => onCopy(tutor.phone ?? '')}
                    >
                        <Copy size={14} />
                    </button>
                </div>
            ),
        },
        {
            title: 'Alamat',
            key: 'address',
            sortable: true,
            className: 'max-w-[200px] truncate',
            render: (tutor: TutorEntity) => (
                <span className="text-slate-400" title={tutor.address ?? ''}>{tutor.address || '-'}</span>
            ),
        },
        {
            title: 'Deskripsi',
            key: 'description',
            sortable: true,
            className: 'max-w-[250px] truncate',
            render: (tutor: TutorEntity) => (
                <span className="text-slate-500" title={tutor.description ?? ''}>{tutor.description || '-'}</span>
            ),
        },
    ], []);

    return (
        <DataPageTemplate<TutorEntity, TutorCreatePayload>
            title="Daftar Tutor"
            description="Kelola data tutor dan informasi kontak."
            columns={columns}
            data={displayTutors}
            isLoading={isLoading}
            totalItems={response?.pagination?.total || 0}
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
                component: TutorMutationForm,
                resolver: zodResolver(TutorCreateSchema),
                emptyValues: {
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    description: '',
                },
                defaultValues: (tutor) => ({
                    name: tutor.name ?? '',
                    phone: tutor.phone ?? '',
                    email: tutor.email ?? '',
                    address: tutor.address ?? '',
                    description: tutor.description ?? '',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Tutor',
                    modalTitle: 'Tambah Tutor',
                    modalDescription: 'Isi form di bawah ini untuk menambahkan data tutor baru.',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (tutor) => `Edit Tutor — ${tutor.name}`,
                    modalDescription: 'Perbarui informasi tutor di bawah ini.',
                    onConfirm: async (item, data) => {
                        await editMutation.mutateAsync({ id: item.id ?? '', data });
                    },
                },
                delete: {
                    onConfirm: async (item) => {
                        await deleteMutation.mutateAsync({ id: item.id ?? '' });
                    },
                },
            }}
        />
    );
};

export default TutorMainContent;
