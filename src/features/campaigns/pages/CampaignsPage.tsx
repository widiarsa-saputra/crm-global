import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Calendar, Users, Percent, Edit, Play, FileText, Loader2, Trash2 } from 'lucide-react';
import { useIndexCampaign } from '@/services/campaign';
import { useDeleteCampaign } from '@/services/campaign';
import { useUpdateCampaign } from '@/services/campaign';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';

const CampaignsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Mock Data for Blast Campaigns
    const mockCampaigns = [
        {
            id: 1,
            name: "Promo Ramadhan 2026",
            segment: "VIP & Hot Leads",
            date: "2026-03-10 10:00",
            status: "scheduled" as const,
            openRate: 0,
            clickRate: 0
        },
        {
            id: 2,
            name: "Product Update v2.5",
            segment: "All Active Users",
            date: "2026-02-15 14:30",
            status: "completed" as const,
            openRate: 45.2,
            clickRate: 12.5
        },
        {
            id: 3,
            name: "Re-engagement Campaign",
            segment: "Inactive",
            date: "2026-01-20 09:00",
            status: "completed" as const,
            openRate: 18.4,
            clickRate: 3.2
        },
        {
            id: 4,
            name: "Welcome Onboarding",
            segment: "New Signups",
            date: "-",
            status: "draft" as const,
            openRate: 0,
            clickRate: 0
        }
    ];

    const { data: apiCampaigns, isError, isLoading } = useIndexCampaign();
    const deleteMutation = useDeleteCampaign();
    const updateMutation = useUpdateCampaign();

    const campaigns = isError || !apiCampaigns ? mockCampaigns : apiCampaigns.data.map(c => ({
        id: c.id,
        name: c.campaign_name,
        segment: c.segment_name || "Unknown Segment",
        date: c.date,
        status: c.status,
        openRate: c.open_rate,
        clickRate: c.click_rate
    }));

    const paginatedCampaigns = campaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>;
            case 'scheduled': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Scheduled</Badge>;
            case 'processing': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Processing</Badge>;
            case 'failed': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Failed</Badge>;
            default: return <Badge variant="secondary" className="text-gray-500">Draft</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 h-full flex flex-col bg-slate-50/50">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            Email Campaigns
                            {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage and schedule your email blasts.</p>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                    </Button>
                </div>
                
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search campaigns..."
                            className="pl-8 bg-white"
                        />
                    </div>
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Filter by Date
                    </Button>
                </div>
                
                {/* Table */}
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-auto flex-1">
                        <Table>
                            <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead>Campaign Name</TableHead>
                                    <TableHead>Target Segment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Schedule Date</TableHead>
                                    <TableHead className="text-right">Open Rate</TableHead>
                                    <TableHead className="text-right">Click Rate</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCampaigns.map((campaign) => (
                                    <TableRow key={campaign.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{campaign.name}</span>
                                                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> Template linked
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                {campaign.segment}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                        <TableCell className="text-muted-foreground">{campaign.date}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {campaign.openRate}% <Percent className="w-3 h-3 text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {campaign.clickRate}% <Percent className="w-3 h-3 text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {campaign.status === 'draft' ? (
                                                    <>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-blue-600"
                                                            onClick={() => updateMutation.mutate({ id: campaign.id, data: { status: 'scheduled' } })}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                                            <Play className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button variant="outline" size="sm">
                                                        View Report
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600"
                                                    onClick={() => deleteMutation.mutate({ id: Number(campaign.id) })}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <PaginationWithShow
                        totalItems={campaigns.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default CampaignsPage;
