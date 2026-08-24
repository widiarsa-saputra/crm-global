import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreHorizontal, User, Mail, Building, Trash2, Edit2, MoveRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/services/contact';

interface ContactDirectoryProps {
    activeSegmentId: string | null;
}

export const ContactDirectory: React.FC<ContactDirectoryProps> = ({ activeSegmentId }) => {
    // Mock data for contacts
    const mockContacts = Array.from({ length: 12 }).map((_, i) => ({
        id: i.toString(),
        name: `Contact Name ${i + 1}`,
        email: `contact${i + 1}@example.com`,
        company: i % 3 === 0 ? 'Tech Corp' : 'Business LLC',
        segment: i % 2 === 0 ? 'VIP' : 'Hot Leads',
        status: i % 5 === 0 ? 'bounced' : (i % 7 === 0 ? 'unsubscribed' : 'valid')
    }));

    const { data: apiResponse, isError, isLoading } = useQuery({
        queryKey: ['contacts', activeSegmentId],
        queryFn: () => contactService.getAll({ segment_id: activeSegmentId || undefined }),
        retry: 1
    });

    const contacts = isError || !apiResponse ? mockContacts : apiResponse.data.map(c => ({
        id: c.id.toString(),
        name: c.nama,
        email: c.email,
        company: c.company || '-',
        segment: c.segment?.name || 'Unassigned',
        status: c.email_status
    }));

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
            <div className="p-4 border-b bg-background flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search name, email, or company..."
                        className="pl-8 bg-muted/50"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />}
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Contact
                    </Button>
                </div>
            </div>

            {/* Grid Content */}
            <ScrollArea className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="bg-background rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem>
                                            <Edit2 className="w-4 h-4 mr-2 text-muted-foreground" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MoveRight className="w-4 h-4 mr-2 text-muted-foreground" /> Move Segment
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex flex-col items-center text-center mt-2 mb-4">
                                <Avatar className="h-16 w-16 mb-3">
                                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                        {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                                <Badge variant="secondary" className="font-medium bg-slate-100 truncate max-w-[50%]">
                                    {contact.segment}
                                </Badge>
                                <Badge className={getStatusColor(contact.status)}>
                                    {contact.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
