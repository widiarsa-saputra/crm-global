import React, { useState, useMemo, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useStudentIndex,
    useStudentCreate,
    useStudentUpdate,
    useStudentDelete,
    StudentEntity,
    StudentCreateSchema,
    StudentCreatePayload,
} from '../../../services/students';
import { StudentMutationForm } from '.';
import { Copy } from 'lucide-react';
import { onCopy } from '@/lib/utils';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';

const StudentMainContent: React.FC = () => {
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
            placeholder: 'Cari siswa atau orang tua...'
        }
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useStudentIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useStudentCreate();
    const editMutation = useStudentUpdate();
    const deleteMutation = useStudentDelete();

    const displayStudents = useMemo(() => {
        return response?.data || [];
    }, [response?.data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        {
            title: 'Nama Siswa',
            key: 'name',
            sortable: true,
            render: (student: StudentEntity) => (
                <span className="font-semibold">{student.name}</span>
            ),
        },
        {
            title: 'Email',
            key: 'email',
            sortable: true,
            render: (student: StudentEntity) => (
                <span className="italic">{student.email || '-'}</span>
            ),
        },
        {
            title: 'No. Telepon',
            key: 'phone',
            sortable: true,
            render: (student: StudentEntity) => (
                <div className="flex items-center gap-4 group">
                    <span className="text-blue-500">{student.phone || '-'}</span>
                    <button
                        className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500"
                        title="Copy No. Telepon"
                        onClick={() => onCopy(student.phone ?? '')}
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
            render: (student: StudentEntity) => (
                <span className="text-slate-400" title={student.address ?? ''}>
                    {student.address || '-'}
                </span>
            ),
        },
        {
            title: 'Nama Orang Tua',
            key: 'parent_name',
            sortable: true,
            render: (student: StudentEntity) => (
                <span className="font-bold">{student.parent_name}</span>
            ),
        },
    ], []);

    const totalItems = response?.pagination?.total || 0;

    return (
        <DataPageTemplate<StudentEntity, StudentCreatePayload>
            title="Daftar Siswa"
            description="Kelola data siswa, informasi kontak, dan orang tua."
            columns={columns}
            data={displayStudents}
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
                component: StudentMutationForm,
                resolver: zodResolver(StudentCreateSchema),
                emptyValues: {
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    parent_name: '',
                },
                defaultValues: (student) => ({
                    name: student.name ?? '',
                    phone: student.phone ?? '',
                    email: student.email ?? '',
                    address: student.address ?? '',
                    parent_name: student.parent_name ?? '',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Siswa',
                    modalTitle: 'Tambah Siswa',
                    modalDescription: 'Isi form di bawah ini untuk menambahkan data siswa baru.',
                    modalSize: 'md',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (student) => `Edit Siswa — ${student.name}`,
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

export default StudentMainContent;
