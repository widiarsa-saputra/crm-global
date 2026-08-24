const fs = require('fs');
const path = require('path');

const features = [
    {
        folder: 'course-categories',
        entity: 'CourseCategory',
        title: 'Kategori Kursus',
        fields: [
            { name: 'name', label: 'Nama Kategori', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text' },
            { name: 'icon', label: 'Icon', type: 'text' },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
        ]
    },
    {
        folder: 'courses',
        entity: 'Course',
        title: 'Kursus',
        fields: [
            { name: 'title', label: 'Judul Kursus', type: 'text', required: true },
            { name: 'short_description', label: 'Deskripsi Singkat', type: 'textarea' },
            { name: 'level', label: 'Level', type: 'text' },
            { name: 'price', label: 'Harga', type: 'number' },
            { name: 'status', label: 'Status', type: 'text' }
        ]
    },
    {
        folder: 'course-sections',
        entity: 'CourseSection',
        title: 'Bagian Kursus',
        fields: [
            { name: 'title', label: 'Judul Bagian', type: 'text', required: true },
            { name: 'sort_order', label: 'Urutan', type: 'number' },
        ]
    },
    {
        folder: 'lessons',
        entity: 'Lesson',
        title: 'Pelajaran',
        fields: [
            { name: 'title', label: 'Judul Pelajaran', type: 'text', required: true },
            { name: 'type', label: 'Tipe', type: 'text' },
            { name: 'duration_seconds', label: 'Durasi (Detik)', type: 'number' },
        ]
    }
];

const generateTemplates = (feature) => {
    const { folder, entity, title, fields } = feature;
    const lowerEntity = entity.charAt(0).toLowerCase() + entity.slice(1);

    const formFields = fields.map(f => {
        if (f.type === 'textarea') {
            return `
                <div>
                    <LabelComp${f.required ? ' required' : ''}>${f.label}</LabelComp>
                    <Textarea {...register('${f.name}')} placeholder="Masukkan ${f.label.toLowerCase()}" rows={3} className="!text-xs placeholder:!text-slate-400" />
                    {errors.${f.name} && <span className="text-red-500 text-xs">{errors.${f.name}.message as string}</span>}
                </div>`;
        }
        return `
                <div>
                    <LabelComp${f.required ? ' required' : ''}>${f.label}</LabelComp>
                    <Input type="${f.type === 'number' ? 'number' : 'text'}" {...register('${f.name}')} placeholder="Masukkan ${f.label.toLowerCase()}" />
                    {errors.${f.name} && <span className="text-red-500 text-xs">{errors.${f.name}.message as string}</span>}
                </div>`;
    }).join('\n');

    const formResetFields = fields.map(f => `                ${f.name}: item.${f.name} ?? undefined,`).join('\n');
    const defaultValuesFields = fields.map(f => `            ${f.name}: item?.${f.name} ?? undefined,`).join('\n');
    
    // 1. Page
    const pageContent = `import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import ${entity}MainContent from '../components/${entity}MainContent';

export const ${entity}Page: React.FC = () => {
    return (
        <AdminLayout>
            <div className="flex-1 w-full flex flex-col min-h-0 bg-slate-50/50">
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <${entity}MainContent />
                </div>
            </div>
        </AdminLayout>
    );
};
`;

    // 2. Main Content
    const mainContent = `import React, { useMemo, useState, useEffect } from 'react';
import BaseTable from '@/components/table/BaseTable';
import PaginationWithShow from '@/components/PaginationWithShow';
import useDebounce from '@/shared/hooks/useDebounce';
import { useTopbarActions } from '@/shared/hooks/useTopbarActions';
import { TopbarActionConfig } from '@/shared/components/topbar/TopBar';
import { ${entity}Entity } from '@/services/${folder}/schema/${entity}Schema';
import { use${entity}Index } from '@/services/${folder}/hooks/use${entity}CRUD';
import Add${entity} from './Add${entity}';
import Update${entity} from './Update${entity}';
import Remove${entity} from './Remove${entity}';
import { Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import EmptyState from '@/components/EmptyState';

const ${entity}MainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedItem, setSelectedItem] = useState<${entity}Entity | null>(null);
    const [dialog, setDialog] = useState<'update' | 'remove' | null>(null);

    const { data, isLoading } = use${entity}Index({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage]);

    const topbarConfig: TopbarActionConfig = useMemo(() => ({
        title: '${title}',
        description: 'Kelola data ${title.toLowerCase()}',
        search: {
            placeholder: 'Cari ${title.toLowerCase()}...',
            value: search,
            onChange: setSearch
        }
    }), [search]);

    useTopbarActions(topbarConfig);

    const columns = useMemo<ColumnDef<${entity}Entity>[]>(() => [
        ${fields.slice(0, 3).map(f => `
        {
            header: '${f.label}',
            accessorKey: '${f.name}',
        },`).join('')}
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                            setSelectedItem(row.original);
                            setDialog('update');
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                            setSelectedItem(row.original);
                            setDialog('remove');
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], []);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari ${title.toLowerCase()}..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-72 h-10 pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                <Add${entity} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <BaseTable
                    columns={columns}
                    data={displayData}
                    isLoading={isLoading}
                    emptyState={
                        <EmptyState
                            title="Data ${title} Kosong"
                            description="Belum ada data yang tersedia saat ini."
                            icon={Search}
                        />
                    }
                />
            </div>

            {meta && meta.total > 0 && (
                <PaginationWithShow
                    totalItems={meta.total}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            )}

            <Update${entity}
                item={selectedItem}
                open={dialog === 'update'}
                onOpenChange={(open) => {
                    if (!open) {
                        setDialog(null);
                        setSelectedItem(null);
                    }
                }}
            />

            <Remove${entity}
                item={selectedItem}
                open={dialog === 'remove'}
                onOpenChange={(open) => {
                    if (!open) {
                        setDialog(null);
                        setSelectedItem(null);
                    }
                }}
            />
        </div>
    );
};

export default ${entity}MainContent;
`;

    // 3. Add Component
    const addContent = `import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ${entity}MutationForm from './${entity}MutationForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ${entity}CreateSchema, ${entity}CreatePayload } from '@/services/${folder}/schema/${entity}Schema';
import { use${entity}Create } from '@/services/${folder}/hooks/use${entity}CRUD';

const Add${entity}: React.FC = () => {
    const [open, setOpen] = useState(false);
    const mutation = use${entity}Create();
    const form = useForm<${entity}CreatePayload>({
        resolver: zodResolver(${entity}CreateSchema),
    });

    const handleValidSubmit = async (data: ${entity}CreatePayload) => {
        await mutation.mutateAsync(data);
        form.reset();
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title="Tambah ${title}"
            description="Isi form berikut untuk menambahkan ${title.toLowerCase()} baru."
            trigger={
                <Button className="w-full sm:w-auto h-10 px-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah ${title}
                </Button>
            }
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button disabled={mutation.isPending} form="${folder}-form" type="submit">
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            }
        >
            <${entity}MutationForm
                open={open}
                mutation={mutation}
                form={form as any}
                onSubmit={form.handleSubmit(handleValidSubmit)}
            />
        </Modal>
    );
};

export default Add${entity};
`;

    // 4. Update Component
    const updateContent = `import React, { useEffect } from 'react';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import ${entity}MutationForm from './${entity}MutationForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ${entity}UpdateSchema, ${entity}UpdatePayload, ${entity}Entity } from '@/services/${folder}/schema/${entity}Schema';
import { use${entity}Update } from '@/services/${folder}/hooks/use${entity}CRUD';

interface Props {
    item: ${entity}Entity | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Update${entity}: React.FC<Props> = ({ item, open, onOpenChange }) => {
    const mutation = use${entity}Update();
    const form = useForm<${entity}UpdatePayload>({
        resolver: zodResolver(${entity}UpdateSchema),
        defaultValues: {
${defaultValuesFields}
        }
    });

    useEffect(() => {
        if (open && item) {
            form.reset({
${formResetFields}
            });
            mutation.reset();
        }
    }, [open, item, form, mutation]);

    const handleValidSubmit = async (data: ${entity}UpdatePayload) => {
        await mutation.mutateAsync({
            id: item?.id ?? '',
            data
        });
        onOpenChange(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Edit ${title}"
            description="Perbarui informasi ${title.toLowerCase()}."
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button disabled={mutation.isPending} form="${folder}-form" type="submit">
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            }
        >
            <${entity}MutationForm
                open={open}
                mutation={mutation}
                form={form as any}
                onSubmit={form.handleSubmit(handleValidSubmit)}
            />
        </Modal>
    );
};

export default Update${entity};
`;

    // 5. Remove Component
    const removeContent = `import React from 'react';
import AlertDialog from '@/components/AlertDialog';
import { use${entity}Delete } from '@/services/${folder}/hooks/use${entity}CRUD';
import { ${entity}Entity } from '@/services/${folder}/schema/${entity}Schema';
import toast from 'react-hot-toast';

interface Props {
    item: ${entity}Entity | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Remove${entity}: React.FC<Props> = ({ item, open, onOpenChange }) => {
    const { mutateAsync, isPending } = use${entity}Delete();

    const handleDelete = async () => {
        if (!item?.id) return;
        try {
            await mutateAsync({ id: item.id });
            toast.success('${title} berhasil dihapus');
            onOpenChange(false);
        } catch (error) {
            toast.error('Gagal menghapus ${title.toLowerCase()}');
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Hapus ${title}"
            description={\`Apakah Anda yakin ingin menghapus "\${item?.${fields[0].name} ?? ''}"? Tindakan ini tidak dapat dibatalkan.\`}
            onConfirm={handleDelete}
            confirmText="Hapus"
            cancelText="Batal"
            isDestructive={true}
            isLoading={isPending}
        />
    );
};

export default Remove${entity};
`;

    // 6. Mutation Form Component
    const formContent = `import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelComp from '@/components/LabelComp';
import { ${entity}CreatePayload } from '@/services/${folder}/schema/${entity}Schema';
import { UseMutationResult } from '@tanstack/react-query';
import { SubmitLoading } from '@/components/SubmitLoading';

interface Props {
    open: boolean;
    mutation: UseMutationResult<any, any, any>;
    form: UseFormReturn<any>;
    onSubmit: () => void;
}

const ${entity}MutationForm: React.FC<Props> = ({ open, mutation, form, onSubmit }) => {
    const { register, formState: { errors }, reset } = form;

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    return (
        <>
            <form className="flex flex-col gap-4" onSubmit={e => {
                e.preventDefault();
                onSubmit();
            }} id="${folder}-form">
${formFields}
            </form>
            <SubmitLoading mutation={mutation} />
        </>
    );
};

export default ${entity}MutationForm;
`;

    // Write Files
    const basePath = path.join(__dirname, 'src', 'features', folder);
    const pagesPath = path.join(basePath, 'pages');
    const componentsPath = path.join(basePath, 'components');

    fs.mkdirSync(pagesPath, { recursive: true });
    fs.mkdirSync(componentsPath, { recursive: true });

    fs.writeFileSync(path.join(pagesPath, entity + 'Page.tsx'), pageContent);
    fs.writeFileSync(path.join(pagesPath, 'index.ts'), "export * from './" + entity + "Page';\n");
    
    fs.writeFileSync(path.join(componentsPath, entity + 'MainContent.tsx'), mainContent);
    fs.writeFileSync(path.join(componentsPath, 'Add' + entity + '.tsx'), addContent);
    fs.writeFileSync(path.join(componentsPath, 'Update' + entity + '.tsx'), updateContent);
    fs.writeFileSync(path.join(componentsPath, 'Remove' + entity + '.tsx'), removeContent);
    fs.writeFileSync(path.join(componentsPath, entity + 'MutationForm.tsx'), formContent);
    
    const indexTsContent = "export { default as " + entity + "MainContent } from './" + entity + "MainContent';\n" +
"export { default as Add" + entity + " } from './Add" + entity + "';\n" +
"export { default as Update" + entity + " } from './Update" + entity + "';\n" +
"export { default as Remove" + entity + " } from './Remove" + entity + "';\n" +
"export { default as " + entity + "MutationForm } from './" + entity + "MutationForm';\n";
    
    fs.writeFileSync(path.join(componentsPath, 'index.ts'), indexTsContent);

    console.log("Successfully generated files for " + entity);
};

features.forEach(generateTemplates);
