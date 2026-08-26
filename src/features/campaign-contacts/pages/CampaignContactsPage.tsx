import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { BaseTable } from '@/shared/components/table/BaseTable';

import { Badge } from '@/components/ui/badge';

import { Users, Percent, FileText, Loader2 } from 'lucide-react';
import { useIndexCampaign, useIndexCampaignContact } from '@/services/campaign/hooks/useCampaignCRUD';

import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';

import { SingleCampaignResponse } from '@/services/campaign';
import { getMetricColor } from '@/lib/utils';

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
    const { data: apiCampaignsRes, isError: isCampaignsError, isFetching: isCampaignsLoading } = useIndexCampaign();
    const apiCampaigns = apiCampaignsRes?.data || [];

    useEffect(() => {
        if (!selectedCampaignId && apiCampaigns.length > 0) {
            setSelectedCampaignId(apiCampaigns[0].id);
        }
    }, [apiCampaigns, selectedCampaignId]);

    // API Query for Campaign Contacts Details
    const { data: apiContactsRes, isError: isContactsError, isFetching: isContactsLoading } = useIndexCampaignContact({
        params: {
            'filter[campaign_id]': selectedCampaignId,
            page: contactPage,
            paginate: contactItemsPerPage,
            search: contactSearch || undefined,
            include: 'contact'
        },
        enabled: !!selectedCampaignId
    });
    const apiContacts = apiContactsRes?.data || [];
    const contactMeta = apiContactsRes?.pagination;

    type MappedCampaign = {
        id: string | number;
        name: string;
        segment: string;
        date: string;
        status: string;
        openRate: number;
        clickRate: number;
        delivered: number;
        sent: number;
    };

    type MappedContact = {
        id: string | number;
        name: string;
        email: string;
        status: string;
        isOpen: boolean;
        isClicked: boolean;
        openFrequency: number;
        clickFrequency: number;
        sentAt: string;
        errorMessage?: string | null;
    };

    const campaigns: MappedCampaign[] = isCampaignsError || !apiCampaigns ? [] : apiCampaigns.map((c: SingleCampaignResponse) => ({
        id: c.id,
        name: c.campaign_name,
        segment: c.segment_name || "-",
        date: c.date,
        status: c.status,
        openRate: c.open_rate,
        clickRate: c.click_rate,
        delivered: c.delivered || 0,
        sent: c.sent || 0
    }));

    const contacts: MappedContact[] = isContactsError || !apiContacts ? [] : apiContacts.map((c) => ({
        id: c.id,
        name: c.contact?.nama || "Unknown",
        email: c.contact?.email || c.email || c.contact_email || "Unknown",
        status: c.status || c.send_status || "queued",
        isOpen: !!c.opened_at || c.is_open || false,
        isClicked: !!c.clicked_at || c.is_clicked || false,
        openFrequency: c.open_frequency || 0,
        clickFrequency: c.click_frequency || 0,
        sentAt: c.sent_at ? new Date(c.sent_at).toLocaleDateString('id-ID') : "-",
        errorMessage: c.error_message
    }));

    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

    const filteredContacts = contacts; // server-side filtering applied

    const filteredCampaigns = campaigns.filter((c) =>
        c.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.segment.toLowerCase().includes(campaignSearch.toLowerCase())
    );

    const paginatedCampaigns = filteredCampaigns.slice(
        (campaignPage - 1) * campaignItemsPerPage,
        campaignPage * campaignItemsPerPage
    );

    return (
        <AdminLayout>
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* TOP SECTION: Campaign Contacts Detail */}
                <div className="p-6 flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Contact Tracking
                                {(isContactsLoading || isCampaignsLoading) && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                                {selectedCampaign && (
                                    <Badge className="ml-2 font-normal">
                                        Campaign: {selectedCampaign.name}
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

                    <div className="bg-white border rounded shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-auto">
                            <BaseTable
                                columns={[
                                    { title: "Contact Name", key: "name", render: (c: MappedContact) => <span className="font-medium">{c.name}</span> },
                                    { title: "Email", key: "email", render: (c: MappedContact) => <span className="text-muted-foreground">{c.email}</span> },
                                    {
                                        title: "Status", key: "status", render: (c: MappedContact) => (
                                            c.status === 'sent' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Sent</Badge>
                                            ) : c.status === 'failed' ? (
                                                <Badge
                                                    title={c.errorMessage || "Failed to send"}
                                                    className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 cursor-help"
                                                >
                                                    Failed
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Queued</Badge>
                                            )
                                        )
                                    },
                                    { title: "Opens", key: "openFrequency", className: "text-center", render: (c: MappedContact) => <span className={`font-semibold ${getMetricColor(c.openFrequency)}`}>{c.openFrequency} <span className="font-normal">times</span></span> },
                                    { title: "Clicks", key: "clickFrequency", className: "text-center", render: (c: MappedContact) => <span className={`font-semibold ${getMetricColor(c.clickFrequency)}`}>{c.clickFrequency} <span className="font-normal">times</span></span> },
                                    { title: "Sent Time", key: "sentAt", className: "text-right", render: (c: MappedContact) => <span className="text-muted-foreground">{c.sentAt}</span> }
                                ]}
                                data={filteredContacts}
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
                <div className="flex-none border-t flex flex-col p-6 gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            Select Campaign to View
                            {isCampaignsLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                        </h3>
                        <DebouncedSearchInput
                            value={campaignSearch}
                            onChange={(v) => { setCampaignSearch(v); setCampaignPage(1); }}
                            placeholder="Search campaign..."
                        />
                    </div>
                    <div className="bg-white border rounded shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-auto flex-1">
                            <BaseTable
                                columns={[
                                    {
                                        title: "Campaign Name", copyValue: false, key: "name", render: (c: MappedCampaign) => (
                                            <div className="flex flex-col">
                                                <span className="font-medium">{c.name}</span>
                                                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> Template linked
                                                </span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Target Segment", key: "segment", render: (c: MappedCampaign) => (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                {c.segment}
                                            </div>
                                        )
                                    },
                                    { title: "Status", key: "status", render: (c: MappedCampaign) => getStatusBadge(c.status) },
                                    {
                                        title: "Date", key: "date", render: (c: MappedCampaign) => (
                                            <span className="text-muted-foreground">
                                                {c.date ? new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                            </span>
                                        )
                                    },
                                    {
                                        title: "Total Delivered", key: "delivered", className: "text-right", render: (c: MappedCampaign) => (
                                            <div className="font-semibold">
                                                {c.delivered} <span className="font-normal">mail</span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Total Sent", key: "sent", className: "text-right", render: (c: MappedCampaign) => (
                                            <div className="font-semibold">
                                                {c.sent} <span className="font-normal">mail</span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Open Rate", key: "openRate", className: "text-right", render: (c: MappedCampaign) => (
                                            <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(c.openRate)}`}>
                                                {c.openRate} <Percent className="w-3 h-3 opacity-70" />
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Click Rate", key: "clickRate", className: "text-right", render: (c: MappedCampaign) => (
                                            <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(c.clickRate)}`}>
                                                {c.clickRate} <Percent className="w-3 h-3 opacity-70" />
                                            </div>
                                        )
                                    }
                                ]}
                                data={paginatedCampaigns}
                                isLoading={isCampaignsLoading}
                                onRowClick={(c: MappedCampaign) => setSelectedCampaignId(c.id)}
                                rowClassName={(c: MappedCampaign) => `cursor-pointer ${selectedCampaignId === c.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-slate-50'}`}
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
