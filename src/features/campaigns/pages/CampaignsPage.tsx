import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { FloatingDateInput, FloatingInput } from '@/components/FloatingInput';
import { BaseTable, Column } from '@/shared/components/table/BaseTable';
import { Plus, Users, Percent, Edit, FileText, Loader2, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { SingleCampaignResponse, useIndexCampaign } from '@/services/campaign';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import { SegmentSidebar } from '@/features/contacts/components/SegmentSidebar';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';
import { getMetricColor } from '@/lib/utils';

import { CreateCampaignModal } from '../components/CreateCampaignModal';
import { EditCampaignModal } from '../components/EditCampaignModal';
import { RemoveCampaignAlert } from '../components/RemoveCampaignAlert';
import { CampaignDetailModal } from '../components/CampaignDetailModal';
import { getStatusBadge } from '@/features/campaign-contacts/pages/CampaignContactsPage';

const CampaignsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
    const [scheduleTime, setScheduleTime] = useState('');

    const [selectedCampaign, setSelectedCampaign] = useState<SingleCampaignResponse | null>(null);
    const [dialog, setDialog] = useState<'create' | 'edit' | 'delete' | 'detail' | null>(null);

    const handleOpenDialog = (type: 'create' | 'edit' | 'delete' | 'detail', campaign?: SingleCampaignResponse) => {
        setSelectedCampaign(campaign || null);
        setDialog(type);
    };

    const handleCloseDialog = () => {
        setDialog(null);
        setSelectedCampaign(null);
    };

    const { data: apiCampaigns, isLoading } = useIndexCampaign({
        params: {
            page: currentPage,
            paginate: itemsPerPage, // Or paginate, depending on API
            search: searchTerm || undefined,
            filter: {
                segment_id: activeSegmentId === 'unassigned' ? null : activeSegmentId || undefined,
                schedule_date: scheduleDate ? `${scheduleDate.getFullYear()}-${String(scheduleDate.getMonth() + 1).padStart(2, '0')}-${String(scheduleDate.getDate()).padStart(2, '0')}` : undefined,
                time: scheduleTime || undefined,
            },
            include: "campaignContacts"
        }
    });

    const campaigns = apiCampaigns?.data || [];
    const totalItems = apiCampaigns?.pagination?.total || campaigns.length;

    const columns: Column<SingleCampaignResponse>[] = [
        {
            title: "Campaign Name",
            key: "campaign_name",
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
            key: "segment_name",
            render: (campaign) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    {campaign.segment_name || '-'}
                </div>
            )
        },
        {
            title: "Status",
            key: "status",
            render: (campaign) => getStatusBadge(campaign.status)
        },
        {
            title: "Total email",
            key: "total_email",
            render: (campaign) => campaign.total_email
        },
        {
            title: "Schedule Date",
            key: "date",
            render: (campaign) => (
                <span className="text-muted-foreground">
                    {campaign.date ? new Date(campaign.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '-'}
                    {campaign.time ? `  ${campaign.time}` : ''}
                </span>
            )
        },
        {
            title: "Open Rate",
            key: "open_rate",
            className: "text-right",
            render: (campaign) => (
                <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(campaign.open_rate)}`}>
                    {campaign.open_rate} <Percent className="w-3 h-3 opacity-70" />
                </div>
            )
        },
        {
            title: "Click Rate",
            key: "click_rate",
            className: "text-right",
            render: (campaign) => (
                <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(campaign.click_rate)}`}>
                    {campaign.click_rate} <Percent className="w-3 h-3 opacity-70" />
                </div>
            )
        },
        {
            title: "Actions",
            key: "id",
            copyValue: false,
            className: "text-right justify-end",
            render: (campaign) => (
                <div className="flex justify-end gap-2 w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-600"
                        title="View Details"
                        onClick={() => handleOpenDialog('detail', campaign)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>

                    {campaign.status !== 'completed' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            title="Edit Campaign"
                            onClick={() => handleOpenDialog('edit', campaign)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        title="Delete Campaign"
                        onClick={() => handleOpenDialog('delete', campaign)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="flex h-full flex-1 bg-slate-50/50 overflow-hidden">
                <SegmentSidebar
                    activeSegmentId={activeSegmentId}
                    onSelectSegment={setActiveSegmentId}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    {/* <header className="flex justify-between items-center mb-6 shrink-0">
                        <section>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                Email Campaigns
                                {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                            </h1>
                            <p className="text-muted-foreground mt-1">Manage and schedule your email blasts.</p>
                        </section>
                        <Button onClick={() => handleOpenDialog('create')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Campaign
                        </Button>
                    </header> */}
                    <header className="p-3 pl-4 pr-0 border-b flex items-center justify-between gap-x-4">
                        {/* Filters */}
                        <div className="flex gap-4 shrink-0">
                            <div className="relative flex-1 max-w-md">
                                <DebouncedSearchInput
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Search campaigns..."
                                    className="bg-white"
                                />
                            </div>
                            <div className="w-64">
                                <FloatingDateInput
                                    id="filter-date"
                                    label="Filter Date"
                                    icon={Calendar}
                                    value={scheduleDate}
                                    onChange={setScheduleDate}
                                    placeholder="All Dates"
                                    inputProps={{ className: "bg-white" }}
                                />
                            </div>
                            <div className="w-fit">
                                <FloatingInput
                                    id="filter-time"
                                    label="Filter Time"
                                    icon={Clock}
                                    type="time"
                                    watch={scheduleTime}
                                    inputProps={{
                                        value: scheduleTime,
                                        onChange: (e) => setScheduleTime(e.target.value),
                                        className: "bg-white"
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />}

                            <Button onClick={() => handleOpenDialog('create')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Campaign
                            </Button>
                        </div>
                    </header>



                    {/* Table */}
                    <div className="p-4 pr-0 flex-1 flex flex-col">
                        <div className="bg-white border rounded overflow-hidden flex-1 flex flex-col">
                            <div className="overflow-auto flex-1">
                                <BaseTable
                                    columns={columns}
                                    data={campaigns}
                                    isLoading={isLoading}
                                    className="border-none"
                                    skeletonRows={itemsPerPage}
                                />
                            </div>
                            {totalItems > 0 && (
                                <PaginationWithShow
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateCampaignModal
                isOpen={dialog === 'create'}
                onClose={handleCloseDialog}
            />

            <EditCampaignModal
                campaign={selectedCampaign}
                isOpen={dialog === 'edit'}
                onClose={handleCloseDialog}
            />
            {selectedCampaign && (
                <>
                    <RemoveCampaignAlert
                        campaign={selectedCampaign}
                        isOpen={dialog === 'delete'}
                        onClose={handleCloseDialog}
                    />
                    <CampaignDetailModal
                        campaign={selectedCampaign}
                        isOpen={dialog === 'detail'}
                        onClose={handleCloseDialog}
                    />
                </>
            )}
        </AdminLayout>
    );
};

export default CampaignsPage;
