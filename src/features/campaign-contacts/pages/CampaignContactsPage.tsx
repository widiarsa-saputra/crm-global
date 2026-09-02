import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { BaseTable } from '@/shared/components/table/BaseTable';

import { Badge } from '@/components/ui/badge';

import { Users, Percent, FileText, Loader2 } from 'lucide-react';
import { useIndexCampaign, useIndexCampaignContact } from '@/services/campaign/hooks/useCampaignCRUD';

import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';

import { SingleCampaignResponse, SingleCampaignContactResponse } from '@/services/campaign';
import { cn, getMetricColor } from '@/lib/utils';

export const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>;

        case 'processing': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Processing</Badge>;
        case 'failed': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Failed</Badge>;
        default: return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Draft</Badge>;
    }
};

const CampaignContactsPage: React.FC = () => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | string>();
    const [campaignPage, setCampaignPage] = useState(1);
    const [campaignItemsPerPage, setCampaignItemsPerPage] = useState(10);
    const [contactSearch, setContactSearch] = useState('');
    const [contactPage, setContactPage] = useState(1);
    const [contactItemsPerPage, setContactItemsPerPage] = useState(10);
    const [campaignSearch, setCampaignSearch] = useState('');

    // API Query for Master Campaign List
    const { data: apiCampaignsRes, isFetching: isCampaignsLoading } = useIndexCampaign();
    const campaigns = apiCampaignsRes?.data || [];

    useEffect(() => {
        if (!selectedCampaignId && campaigns.length > 0) {
            setSelectedCampaignId(campaigns[0].id);
        }
    }, [campaigns, selectedCampaignId]);

    // API Query for Campaign Contacts Details
    const { data: apiContactsRes, isFetching: isContactsLoading } = useIndexCampaignContact({
        params: {
            'filter[campaign_id]': selectedCampaignId,
            page: contactPage,
            paginate: contactItemsPerPage,
            search: contactSearch || undefined,
        },
        enabled: !!selectedCampaignId
    });
    const apiContacts = apiContactsRes?.data || [];
    const contactMeta = apiContactsRes?.pagination;



    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

    const filteredCampaigns = campaigns.filter((c) =>
        c.campaign_name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.segment_name?.toLowerCase().includes(campaignSearch.toLowerCase())
    );

    const paginatedCampaigns = filteredCampaigns.slice(
        (campaignPage - 1) * campaignItemsPerPage,
        campaignPage * campaignItemsPerPage
    );

    return (
        <AdminLayout>
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* TOP SECTION: Campaign Contacts Detail */}
                <div className="py-4 flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Contact Tracking
                                {(isContactsLoading || isCampaignsLoading) && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                                {selectedCampaign && (
                                    <Badge className="ml-2 font-normal">
                                        Campaign: {selectedCampaign.campaign_name}
                                    </Badge>
                                )}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">Detailed tracking of individual contacts for the selected campaign.</p>
                        </div>
                        <DebouncedSearchInput
                            value={contactSearch}
                            onChange={(v) => { setContactSearch(v); setContactPage(1); }}
                            placeholder="Search contact..."
                        />
                    </div>

                    <div className="rounded overflow-hidden flex flex-col">
                        <div className="overflow-auto">
                            <BaseTable
                                columns={[
                                    { title: "Contact Name", key: "contact_name", render: (c: SingleCampaignContactResponse) => <span className="font-medium">{c.contact_name || "Unknown"}</span> },
                                    { title: "Email", key: "email", render: (c: SingleCampaignContactResponse) => <span className="text-muted-foreground">{c.contact_email || c.contact_email || "Unknown"}</span> },
                                    {
                                        title: "Status", 
                                        key: "status", 
                                        copyValue: false,
                                        render: (c: SingleCampaignContactResponse) => {
                                            const status = c.status || c.send_status || "queued";
                                            return status === 'sent' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Sent</Badge>
                                            ) : status === 'failed' ? (
                                                <Badge
                                                    title={c.error_message || "Failed to send"}
                                                    className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 cursor-help"
                                                >
                                                    Failed
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Queued</Badge>
                                            );
                                        }
                                    },
                                    {
                                        title: "Opened", key: "is_open", className: "text-center", render: (c: SingleCampaignContactResponse) => <span className={cn(
                                            "font-medium capitalize",
                                            c.is_open ? 'text-green-600' : 'text-red-600'
                                        )}>{c.is_open ? 'opened' : 'not opened'}</span>
                                    },
                                    {
                                        title: "Clicked", key: "is_clicked", className: "text-center", render: (c: SingleCampaignContactResponse) => <span className={cn(
                                            "font-medium capitalize",
                                            c.is_clicked ? 'text-green-600' : 'text-red-600'
                                        )}>{c.is_clicked ? 'clicked' : 'not clicked'}</span>
                                    },
                                    { title: "Sent Time", key: "sent_at", className: "text-right", render: (c: SingleCampaignContactResponse) => <span className="text-muted-foreground">{c.sent_at ? new Date(c.sent_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}</span> }
                                ]}
                                data={apiContacts}
                                isLoading={isContactsLoading || isCampaignsLoading}
                                rowClassName={() => "hover:bg-slate-50"}
                                emptyMessage="Tidak ada data contact untuk selected campaign"
                            />
                        </div>
                        <PaginationWithShow
                            totalItems={contactMeta?.total || 0}
                            itemsPerPage={contactItemsPerPage}
                            currentPage={contactPage}
                            onPageChange={setContactPage}
                            onItemsPerPageChange={(n) => { setContactItemsPerPage(n); setContactPage(1); }}
                        />
                    </div>
                </div>

                {/* BOTTOM SECTION: Master Campaign List */}
                <div className="flex-none border-t flex flex-col py-2 gap-4">
                    <hgroup className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="font-semibold flex items-center gap-2">
                                Select Campaign to View
                                {isCampaignsLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Please click a row in the table below to load and view the contacts for that campaign.
                            </p>
                        </div>
                        <DebouncedSearchInput
                            value={campaignSearch}
                            onChange={(v) => { setCampaignSearch(v); setCampaignPage(1); }}
                            placeholder="Search campaign..."
                        />
                    </hgroup>
                    <div className="rounded overflow-hidden flex flex-col">
                        <div className="overflow-auto flex-1">
                            <BaseTable
                                columns={[
                                    {
                                        title: "Campaign Name", key: "name", render: (c: SingleCampaignResponse) => (
                                            <div className="flex flex-col">
                                                <span className="font-medium">{c.campaign_name}</span>
                                                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> Template linked
                                                </span>
                                            </div>
                                        ),
                                        copyValue: false
                                    },
                                    {
                                        title: "Target Segment", key: "segment", render: (c: SingleCampaignResponse) => (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                {c.segment_name}
                                            </div>
                                        ),
                                        copyValue: false
                                    },
                                    { title: "Status", key: "status", render: (c: SingleCampaignResponse) => getStatusBadge(c.status) },
                                    {
                                        title: "Date", key: "date", render: (c: SingleCampaignResponse) => (
                                            <span className="text-muted-foreground">
                                                {c.date ? new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                            </span>
                                        ),
                                        copyValue: false
                                    },
                                    {
                                        title: "Total Success", key: "total_delivered", className: "text-right", render: (c: SingleCampaignResponse) => (
                                            <div className="font-semibold">
                                                {c.total_success} <span className="font-normal">mail</span>
                                            </div>
                                        ),
                                        copyValue: false
                                    },
                                    {
                                        title: "Total Email", key: "total_sent", className: "text-right", render: (c: SingleCampaignResponse) => (
                                            <div className="font-semibold">
                                                {c.total_email} <span className="font-normal">mail</span>
                                            </div>
                                        ),
                                        copyValue: false
                                    },
                                    {
                                        title: "Open Rate", key: "open_rate", className: "text-right", render: (c: SingleCampaignResponse) => (
                                            <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(c.open_rate)}`}>
                                                {c.open_rate} <Percent className="w-3 h-3 opacity-70" />
                                            </div>
                                        ),
                                        copyValue: false
                                    },
                                    {
                                        title: "Click Rate", key: "click_rate", className: "text-right", render: (c: SingleCampaignResponse) => (
                                            <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(c.click_rate)}`}>
                                                {c.click_rate} <Percent className="w-3 h-3 opacity-70" />
                                            </div>
                                        ),
                                        copyValue: false
                                    }
                                ]}
                                data={paginatedCampaigns}
                                isLoading={isCampaignsLoading}
                                onRowClick={(c: SingleCampaignResponse) => setSelectedCampaignId(c.id)}
                                rowClassName={(c: SingleCampaignResponse) => `cursor-pointer ${selectedCampaignId === c.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-slate-50'}`}
                            />
                        </div>
                        <PaginationWithShow
                            totalItems={filteredCampaigns.length}
                            itemsPerPage={campaignItemsPerPage}
                            currentPage={campaignPage}
                            onPageChange={setCampaignPage}
                            onItemsPerPageChange={(n) => { setCampaignItemsPerPage(n); setCampaignPage(1); }}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CampaignContactsPage;
