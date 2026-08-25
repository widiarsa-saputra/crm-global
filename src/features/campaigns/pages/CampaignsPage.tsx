import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BaseTable, Column } from '@/shared/components/table/BaseTable';
import { Plus, Search, Calendar, Users, Percent, Edit, FileText, Loader2, Trash2 } from 'lucide-react';
import { SingleCampaignResponse, useIndexCampaign } from '@/services/campaign';
import { useDeleteCampaign } from '@/services/campaign';
import { useUpdateCampaign } from '@/services/campaign';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';

const CampaignsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const mockCampaigns: SingleCampaignResponse[] = [
        {
            id: 1,
            campaign_name: "Promo Ramadhan 2026",
            segment_name: "VIP & Hot Leads",
            date: "2026-03-10 10:00",
            status: "scheduled",
            open_rate: 0,
            click_rate: 0,
            template_id: 1,
            email_subject: "Promo Spesial Ramadhan"
        },
        {
            id: 2,
            campaign_name: "Product Update v2.5",
            segment_name: "All Active Users",
            date: "2026-02-15 14:30",
            status: "completed",
            open_rate: 45.2,
            click_rate: 12.5,
            template_id: 2,
            email_subject: "Cek Fitur Baru v2.5!"
        },
        {
            id: 3,
            campaign_name: "Re-engagement Campaign",
            segment_name: "Inactive",
            date: "2026-01-20 09:00",
            status: "completed",
            open_rate: 18.4,
            click_rate: 3.2,
            template_id: 3,
            email_subject: "Kami merindukan Anda"
        },
        {
            id: 4,
            campaign_name: "Welcome Onboarding",
            segment_name: "New Signups",
            date: "-",
            status: "draft",
            open_rate: 0,
            click_rate: 0,
            template_id: 4,
            email_subject: "Selamat datang di Platform Kami"
        }
    ];

    const { data: apiCampaigns, isError, isLoading } = useIndexCampaign();
    const deleteMutation = useDeleteCampaign();
    const updateMutation = useUpdateCampaign();

    const campaigns = isError || !apiCampaigns ? mockCampaigns : apiCampaigns.data;

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

    const columns: Column<SingleCampaignResponse>[] = [
        {
            title: "Campaign Name",
            key: "name",
            render: (campaign) => (
                <div className="flex flex-col">
                    <span>{campaign.campaign_name}</span>
                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Template linked
                    </span>
                </div>
            )
        },
        {
            title: "Target Segment",
            key: "segment",
            render: (campaign) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    {campaign.segment_name}
                </div>
            )
        },
        {
            title: "Status",
            key: "status",
            render: (campaign) => getStatusBadge(campaign.status)
        },
        {
            title: "Schedule Date",
            key: "date",
            render: (campaign) => <span className="text-muted-foreground">{new Date(campaign.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        },
        {
            title: "Open Rate",
            key: "openRate",
            className: "text-right",
            render: (campaign) => (
                <div className="flex items-center justify-end gap-1">
                    {campaign.open_rate} <Percent className="w-3 h-3 text-muted-foreground" />
                </div>
            )
        },
        {
            title: "Click Rate",
            key: "clickRate",
            className: "text-right",
            render: (campaign) => (
                <div className="flex items-center justify-end gap-1">
                    {campaign.click_rate} <Percent className="w-3 h-3 text-muted-foreground" />
                </div>
            )
        },
        {
            title: "Actions",
            key: "actions",
            className: "text-right justify-end",
            render: (campaign) => (
                <div className="flex justify-end gap-2 w-full">
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
            )
        }
    ];

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
                <div className="bg-white border rounded shadow-sm overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-auto flex-1">
                        <BaseTable 
                            columns={columns} 
                            data={paginatedCampaigns} 
                            isLoading={isLoading} 
                            className="border-none"
                            skeletonRows={itemsPerPage}
                        />
                    </div>
                    {campaigns.length > itemsPerPage && (
                        <PaginationWithShow
                            totalItems={campaigns.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default CampaignsPage;
