import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, Folder, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIndexSegment, SingleSegmentResponse } from '@/services/segments';
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { AddSegmentModal } from './AddSegmentModal';
import { EditSegmentModal } from './EditSegmentModal';
import { RemoveSegmentAlert } from './RemoveSegmentAlert';
import { cn } from '@/lib/utils';

interface SegmentSidebarProps {
    onSelectSegment: (id: string | null) => void;
    activeSegmentId: string | null;
}

type DialogState = 'edit' | 'delete' | null;

export const SegmentSidebar: React.FC<SegmentSidebarProps> = ({ onSelectSegment, activeSegmentId }) => {
    const [search, setSearch] = useState('');

    const { data: apiSegments, isLoading } = useIndexSegment({
        
    });

    const [selectedSegment, setSelectedSegment] = useState<SingleSegmentResponse | null>(null);
    const [dialog, setDialog] = useState<DialogState>(null);

    const segments = apiSegments?.data.map((s) => ({
        id: s.id?.toString() || Math.random().toString(),
        name: s.name,
        count: s.total_contact ?? 0,
        _raw: s,
    })) || [];


    const openDialog = (type: DialogState, segment: SingleSegmentResponse) => {
        setSelectedSegment(segment);
        setDialog(type);
    };

    const closeDialog = () => {
        setDialog(null);
        setSelectedSegment(null);
    };


    return (
        <div className="w-72 shrink-0 border-r flex flex-col h-full">
            <div className="p-4 border-b">
                <AddSegmentModal
                    trigger={
                        <Button className="w-full justify-start gap-2">
                            <Plus className="w-4 h-4" />
                            Add Segment
                        </Button>
                    }
                />
            </div>

            <div className="p-4 border-b space-y-4">
                <DebouncedSearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search segments..."
                    className="w-full"
                    inputClassName="bg-muted/50"
                />

                <div className="space-y-1">
                    <Button
                        variant={activeSegmentId === null ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 h-9 px-2"
                        onClick={() => onSelectSegment(null)}
                    >
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 text-left">All Contacts</span>
                    </Button>
                    <Button
                        variant={activeSegmentId === 'unassigned' ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 h-9 px-2"
                        onClick={() => onSelectSegment('unassigned')}
                    >
                        <Folder className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 text-left">Unassigned</span>
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                        <span>Segments</span>
                    </div>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2 h-9 px-2">
                                <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                                <Skeleton className="h-3 flex-1" />
                                <Skeleton className="w-6 h-4" />
                            </div>
                        ))
                    ) : segments.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            Belum ada segment.
                        </div>
                    ) : (
                        segments.filter(segment => segment.name.toLowerCase().includes(search.toLowerCase())).map((segment) => (
                            <ContextMenu key={segment.id}>
                                <ContextMenuTrigger asChild>
                                    <Button
                                        variant={activeSegmentId === segment.id ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-2 h-9 px-2"
                                        onClick={() => onSelectSegment(segment.id)}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                                        <span className="flex-1 text-left truncate">{segment.name}</span>
                                        <Badge variant="secondary" className={cn("ml-auto font-normal", activeSegmentId === segment.id ? 'bg-background' : 'border bg-background border-slate-200')}>
                                            {segment.count}
                                        </Badge>
                                    </Button>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem
                                        onSelect={() => openDialog('edit', segment._raw)}
                                    >
                                        <Pencil /> Edit
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                        variant="destructive"
                                        onSelect={() => openDialog('delete', segment._raw)}
                                    >
                                        <Trash2 /> Delete
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))
                    )}
                </div>
            </ScrollArea>

            {selectedSegment && dialog === 'edit' && (
                <EditSegmentModal
                    segment={selectedSegment}
                    isOpen={dialog === 'edit'}
                    onClose={closeDialog}
                />
            )}

            {selectedSegment && dialog === 'delete' && (
                <RemoveSegmentAlert
                    segment={selectedSegment}
                    isOpen={dialog === 'delete'}
                    onClose={closeDialog}
                />
            )}
        </div>
    );
};
