import React, { useState, useEffect, startTransition } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { InputRichText } from '@/components/InputRichText';
import { FloatingInput } from '@/components/FloatingInput';
import { Button } from '@/components/ui/button';
import { SubmitLoading } from '@/components/SubmitLoading';
import {
    useIndexTemplate,
    useCreateTemplate,
    useUpdateTemplate,
    useDeleteTemplate,
} from '@/services/templates';
import { SingleTemplateResponse } from '@/services/templates/response/TemplateResponse';
import { Loader2, FilePlus, Save, Trash2 } from 'lucide-react';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';

const TemplatesPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<SingleTemplateResponse | null>(null);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data: indexRes, isLoading } = useIndexTemplate();
    const templates = indexRes?.data ?? [];

    const createMutation = useCreateTemplate();
    const updateMutation = useUpdateTemplate();
    const deleteMutation = useDeleteTemplate();
    const { mutate: createTemplate, isPending: isCreatingPending } = createMutation;
    const { mutate: updateTemplate, isPending: isUpdatingPending } = updateMutation;
    const { mutate: deleteTemplate, isPending: isDeletingPending } = deleteMutation;

    const filteredTemplates = templates.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectTemplate = (template: SingleTemplateResponse) => {
        setSelectedTemplate(template);
        setIsCreating(false);
        startTransition(() => {
            setName(template.name);
            setContent(template.message);
        });
    };

    const handleCreateNew = () => {
        setSelectedTemplate(null);
        setIsCreating(true);
        startTransition(() => {
            setName('');
            setContent('');
        });
    };

    const handleSave = () => {
        if (!name.trim() || !content.trim()) return;

        if (isCreating || !selectedTemplate) {
            createTemplate(
                { name, message: content },
                {
                    onSuccess: (data) => {
                        setSelectedTemplate(data.data);
                        setIsCreating(false);
                    },
                }
            );
        } else {
            updateTemplate({
                id: selectedTemplate.id,
                data: { name, message: content },
            });
        }
    };

    const handleDiscard = () => {
        if (selectedTemplate) {
            startTransition(() => {
                setName(selectedTemplate.name);
                setContent(selectedTemplate.message);
            });
        } else {
            setIsCreating(false);
            startTransition(() => {
                setName('');
                setContent('');
            });
        }
    };

    const handleDelete = () => {
        if (!selectedTemplate) return;
        deleteTemplate(
            { id: selectedTemplate.id },
            {
                onSuccess: () => {
                    setSelectedTemplate(null);
                    setName('');
                    setContent('');
                    setIsCreating(false);
                },
            }
        );
    };

    // Select the first template on load
    useEffect(() => {
        if (templates.length > 0 && !selectedTemplate && !isCreating) {
            handleSelectTemplate(templates[0]);
        }
    }, [templates]);

    const isSaving = isCreatingPending || isUpdatingPending;
    const isDeleting = isDeletingPending;

    return (
        <AdminLayout>
            <SubmitLoading
                mutation={createMutation}
                successMessage="Template berhasil dibuat!"
                errorMessage="Gagal membuat template."
            />
            <SubmitLoading
                mutation={updateMutation}
                successMessage="Template berhasil disimpan!"
                errorMessage="Gagal menyimpan template."
            />
            <SubmitLoading
                mutation={deleteMutation}
                successMessage="Template berhasil dihapus!"
                errorMessage="Gagal menghapus template."
            />
            <div className="p-6 h-full flex flex-col bg-background">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Email Templates</h1>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleCreateNew} className="flex items-center gap-2">
                            <FilePlus className="w-4 h-4" />
                            Create Message Template
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 h-[calc(100vh-140px)]">
                    {/* Left: Template List */}
                    <div className="col-span-1 border rounded-lg p-4 flex flex-col gap-4 bg-slate-50/30">
                        {/* <Input
                        /> */}
                        <DebouncedSearchInput
                            placeholder="Search templates..."
                            value={search}
                            onChange={(e) => setSearch(e)}
                        />
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {isLoading && (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                </div>
                            )}
                            {!isLoading && filteredTemplates.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground py-8">No templates found.</p>
                            )}
                            {filteredTemplates.map((template) => {
                                const isActive = selectedTemplate?.id === template.id && !isCreating;
                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => handleSelectTemplate(template)}
                                        className={`p-3 border rounded cursor-pointer transition-colors ${isActive
                                                ? 'bg-primary/10 border-primary/20'
                                                : 'hover:bg-slate-100'
                                            }`}
                                    >
                                        <h3 className={`font-semibold ${isActive ? 'text-primary' : ''}`}>
                                            {template.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {template.updated_at
                                                ? new Date(template.updated_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : 'No date'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4 border rounded-lg p-6 bg-white shadow-sm">
                        {!isCreating && !selectedTemplate ? (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                <p>Select a template or create a new one.</p>
                            </div>
                        ) : (
                            <>
                                <FloatingInput
                                    id="template-name"
                                    label="Template Name"
                                    required
                                    watch={name}
                                    inputProps={{
                                        value: name,
                                        onChange: (e) => setName(e.target.value),
                                    }}
                                />

                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-sm font-semibold">Dynamic Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setContent(content + ' {{nama}} ')} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                            + {`{{nama}}`}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setContent(content + ' {{company}} ')} className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                                            + {`{{company}}`}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setContent(content + ' {{email}} ')} className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
                                            + {`{{email}}`}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Click a tag above to insert it into the editor at the end of the text.</p>
                                </div>

                                <div className="flex-1 flex flex-col mt-2">
                                    <InputRichText
                                        id="template-content"
                                        label="Message Content"
                                        required
                                        value={content}
                                        onChange={setContent}
                                        placeholder="Write your email content here..."
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t mt-4">
                                    <div>
                                        {!isCreating && selectedTemplate && (
                                            <Button
                                                variant="outline"
                                                onClick={handleDelete}
                                                disabled={isDeleting || isSaving}
                                                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={handleDiscard} disabled={isSaving || isDeleting}>
                                            Discard Changes
                                        </Button>
                                        <Button onClick={handleSave} disabled={isSaving || isDeleting || !name.trim() || !content.trim()} className="flex items-center gap-2">
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {isCreating ? 'Create Template' : 'Save Template'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TemplatesPage;
