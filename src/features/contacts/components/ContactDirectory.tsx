import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';
import { Plus, Mail, Building, Trash2, Edit2, Loader2, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIndexContactInfinite } from '@/services/contacts';
import { SingleContactResponse } from '@/services/contacts';
import { useInView } from 'react-intersection-observer';
import { AddContactModal } from './AddContactModal';
import { EditContactModal } from './EditContactModal';
import { MoveSegmentModal } from './MoveSegmentModal';
import { RemoveContactAlert } from './RemoveContactAlert';
import { UpdateStatusModal } from './UpdateStatusModal';

interface ContactDirectoryProps {
    activeSegmentId: string | null;
}

export const ContactDirectory: React.FC<ContactDirectoryProps> = ({ activeSegmentId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const gridRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);
    const [selectedContact, setSelectedContact] = useState<SingleContactResponse | null>(null);
    const [dialog, setDialog] = useState<'edit' | 'move' | 'delete' | 'status' | null>(null);

    const handleOpenDialog = (type: 'edit' | 'move' | 'delete' | 'status', contact: SingleContactResponse) => {
        setSelectedContact(contact);
        setDialog(type);
    };

    const handleCloseDialog = () => {
        setDialog(null);
        setSelectedContact(null);
    };

    useEffect(() => {
        const currentRef = gridRef.current;
        if (!currentRef) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                const cols = Math.max(1, Math.floor(width / 250));
                setColumns(cols);
            }
        });

        observer.observe(currentRef);
        return () => observer.disconnect();
    }, []);

    const { ref: observerRef, inView } = useInView();

    const { 
        data: apiResponse, 
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useIndexContactInfinite({
        params: { 
            filter: {
                segment_id: activeSegmentId || undefined
            },
            search: searchTerm || undefined,
            paginate: 50
        },
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const contacts = apiResponse ? apiResponse.pages.flatMap((page) => page.data).map((c) => ({
        id: c.id.toString(),
        name: c.nama,
        email: c.email,
        company: c.company || '-',
        segment: c.segment?.name || 'Unassigned',
        status: c.email_status,
        _raw: c,
    })) : [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'bounced': return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'unsubscribed': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between gap-x-4">
                <DebouncedSearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search name, email, or company..."
                    className="flex-1 max-w-md"
                    inputClassName="bg-muted/50"
                />
                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />}
                    <AddContactModal
                        trigger={
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Contact
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* Grid Content */}
            <ScrollArea className="flex-1 p-6">
                <div ref={gridRef}>
                    {isLoading ? (
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {Array.from({ length: columns * 3 || 12 }).map((_, i) => (
                                <div key={i} className="bg-background rounded-xl border p-4 shadow-sm relative flex flex-col items-center min-h-[200px]">
                                    <Skeleton className="h-16 w-16 rounded-full mb-3 mt-2" />
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2 mb-2" />
                                    <Skeleton className="h-3 w-2/3 mb-4" />
                                    <div className="w-full flex items-center justify-between mt-auto pt-4 border-t gap-2">
                                        <Skeleton className="h-5 w-1/3 rounded-full" />
                                        <Skeleton className="h-5 w-1/3 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Belum ada kontak</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                {activeSegmentId === 'unassigned'
                                    ? "Semua kontak saat ini sudah memiliki segmen."
                                    : activeSegmentId
                                    ? "Tidak ada kontak di segmen ini. Silakan tambahkan atau pindahkan kontak ke sini."
                                    : "Anda belum memiliki kontak apa pun. Silakan tambahkan kontak baru untuk mulai."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {contacts.map((contact) => (
                                <div key={contact.id} className="bg-background rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                                    <div className="absolute right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700" 
                                            onClick={() => contact._raw && handleOpenDialog('edit', contact._raw)}
                                            title="Edit Contact"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700" 
                                            onClick={() => contact._raw && handleOpenDialog('delete', contact._raw)}
                                            title="Delete Contact"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-col items-center text-center mt-2 mb-4">
                                        <Avatar className="h-16 w-16 mb-3">
                                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                {contact.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-semibold text-sm line-clamp-1">{contact.name}</h3>
                                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                            <Mail className="w-3 h-3" />
                                            <span className="line-clamp-1">{contact.email}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                            <Building className="w-3 h-3" />
                                            <span className="line-clamp-1">{contact.company}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t gap-2">
                                        <Badge 
                                            title="Click to move segment" 
                                            variant="secondary" 
                                            className="font-medium bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors truncate max-w-[50%]"
                                            onClick={() => contact._raw && handleOpenDialog('move', contact._raw)}
                                        >
                                            {contact.segment}
                                        </Badge>
                                        <Badge 
                                            title="Click to update status"
                                            className={`${getStatusColor(contact.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                                            onClick={() => contact._raw && handleOpenDialog('status', contact._raw)}
                                        >
                                            {contact.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                )}
                <div ref={observerRef} className="h-4 w-full" />
            </ScrollArea>

            {selectedContact && (
                <>
                    <EditContactModal
                        contact={selectedContact}
                        isOpen={dialog === 'edit'}
                        onClose={handleCloseDialog}
                    />
                    <MoveSegmentModal
                        contact={selectedContact}
                        isOpen={dialog === 'move'}
                        onClose={handleCloseDialog}
                    />
                    <UpdateStatusModal
                        contact={selectedContact}
                        isOpen={dialog === 'status'}
                        onClose={handleCloseDialog}
                    />
                    <RemoveContactAlert
                        contact={selectedContact}
                        isOpen={dialog === 'delete'}
                        onClose={handleCloseDialog}
                    />
                </>
            )}
        </div>
    );
};
