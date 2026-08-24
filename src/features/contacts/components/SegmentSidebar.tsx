import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Users, Folder, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { segmentService } from '@/services/segment';

interface SegmentSidebarProps {
    onSelectSegment: (id: string | null) => void;
    activeSegmentId: string | null;
}

export const SegmentSidebar: React.FC<SegmentSidebarProps> = ({ onSelectSegment, activeSegmentId }) => {
    // Mock data fallback
    const mockSegments = [
        { id: '1', name: 'VIP', count: 1250 },
        { id: '2', name: 'Hot Leads', count: 850 },
        { id: '3', name: 'Inactive', count: 3200 },
        { id: '4', name: 'New Signups', count: 450 },
    ];

    const { data: apiSegments, isError, isLoading } = useQuery({
        queryKey: ['segments'],
        queryFn: segmentService.getAll,
        retry: 1
    });

    // Determine segments to render
    const segments = isError || !apiSegments ? mockSegments : apiSegments.map((s) => ({
        id: s.id.toString(),
        name: s.name,
        count: 0, // Fallback to 0 if count is not provided by API
    }));

    return (
        <div className="w-64 border-r bg-background flex flex-col h-full">
            <div className="p-4 border-b">
                <Button className="w-full justify-start gap-2" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Segment
                </Button>
            </div>
            
            <div className="p-4 border-b space-y-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search segments..."
                        className="pl-8 bg-muted/50"
                    />
                </div>
                
                <div className="space-y-1">
                    <Button
                        variant={activeSegmentId === null ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 h-9 px-2"
                        onClick={() => onSelectSegment(null)}
                    >
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 text-left">All Contacts</span>
                        <Badge variant="secondary" className="ml-auto font-normal bg-background">5750</Badge>
                    </Button>
                    <Button
                        variant={activeSegmentId === 'unassigned' ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 h-9 px-2"
                        onClick={() => onSelectSegment('unassigned')}
                    >
                        <Folder className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 text-left">Unassigned</span>
                        <Badge variant="secondary" className="ml-auto font-normal bg-background">0</Badge>
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                        <span>Segments</span>
                        {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    </div>
                    {segments.map((segment) => (
                        <Button
                            key={segment.id}
                            variant={activeSegmentId === segment.id ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 h-9 px-2"
                            onClick={() => onSelectSegment(segment.id)}
                        >
                            <span className="w-2 h-2 rounded-full bg-primary/40"></span>
                            <span className="flex-1 text-left truncate">{segment.name}</span>
                            <Badge variant="secondary" className="ml-auto font-normal bg-background">
                                {segment.count}
                            </Badge>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
