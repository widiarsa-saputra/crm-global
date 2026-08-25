import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { InputRichText } from '@/components/InputRichText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TemplatesPage: React.FC = () => {
    const [content, setContent] = useState('');
    
    return (
        <AdminLayout>
            <div className="p-6 h-full flex flex-col bg-background">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Email Templates</h1>
                    <Button>Create Template</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 h-[calc(100vh-140px)]">
                    {/* Left: Template List */}
                    <div className="col-span-1 border rounded-lg p-4 flex flex-col gap-4 bg-slate-50/30">
                        <Input placeholder="Search templates..." />
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            <div className="p-3 border rounded bg-primary/10 border-primary/20 cursor-pointer">
                                <h3 className="font-semibold text-primary">Welcome Email</h3>
                                <p className="text-xs text-muted-foreground mt-1">Last edited 2 days ago</p>
                            </div>
                            <div className="p-3 border rounded cursor-pointer hover:bg-slate-100 transition-colors">
                                <h3 className="font-semibold">Promo Campaign</h3>
                                <p className="text-xs text-muted-foreground mt-1">Last edited 1 week ago</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right: Editor */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4 border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold">Template Name</label>
                            <Input placeholder="Template Name" defaultValue="Welcome Email" className="font-semibold" />
                        </div>
                        
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
                                value={content} 
                                onChange={setContent} 
                                placeholder="Write your email content here..."
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <Button variant="outline">Discard Changes</Button>
                            <Button>Save Template</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TemplatesPage;
