import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { BaseTable } from '@/shared/components/table/BaseTable';

import { Badge } from '@/components/ui/badge';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { MousePointerClick, CheckCircle2, XCircle, Users, Percent, FileText, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useIndexCampaign } from "@/services/campaign";
import { privateApi } from "@/api/api";
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';

interface ApiCampaign {
    id: string | number;
    campaign_name: string;
    segment_name?: string | null;
    date: string;
    status: string;
    open_rate: number;
    click_rate: number;
}

interface ApiContact {
    id: string | number;
    nama?: string;
    contact_name?: string;
    email?: string;
    contact_email?: string;
    status?: string;
    send_status?: string;
    opened_at?: string | null;
    is_open?: boolean;
    is_clicked?: boolean;
    sent_at?: string | null;
}

const CampaignContactsPage: React.FC = () => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | string>();
    const [campaignPage, setCampaignPage] = useState(1);
    const [campaignItemsPerPage, setCampaignItemsPerPage] = useState(10);
    const [contactSearch, setContactSearch] = useState('');
    const [campaignSearch, setCampaignSearch] = useState('');

    // API Query for Master Campaign List
    const { data: apiCampaignsRes, isError: isCampaignsError, isLoading: isCampaignsLoading } = useIndexCampaign();
    const apiCampaigns = apiCampaignsRes?.data || [];

    useEffect(() => {
        if (!selectedCampaignId && apiCampaigns.length > 0) {
            setSelectedCampaignId(apiCampaigns[0].id);
        }
    }, [apiCampaigns, selectedCampaignId]);

    // API Query for Campaign Contacts Details
    const { data: apiContacts, isError: isContactsError, isLoading: isContactsLoading } = useQuery({
        queryKey: ['campaign-contacts', selectedCampaignId],
        queryFn: () => privateApi.get(`/v1/campaigns/${selectedCampaignId}/contacts`).then(res => res.data.data),
        retry: 1
    });

    type MappedCampaign = {
        id: string | number;
        name: string;
        segment: string;
        date: string;
        status: string;
        openRate: number;
        clickRate: number;
    };

    type MappedContact = {
        id: string | number;
        name: string;
        email: string;
        status: string;
        isOpen: boolean;
        isClicked: boolean;
        sentAt: string;
    };

    const campaigns: MappedCampaign[] = isCampaignsError || !apiCampaigns ? [] : apiCampaigns.map((c: ApiCampaign) => ({
        id: c.id,
        name: c.campaign_name,
        segment: c.segment_name || "Unknown Segment",
        date: c.date,
        status: c.status,
        openRate: c.open_rate,
        clickRate: c.click_rate
    }));

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>;
            case 'scheduled': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Scheduled</Badge>;
            case 'processing': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Processing</Badge>;
            case 'failed': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Failed</Badge>;
            default: return <Badge variant="secondary" className="text-gray-500">Draft</Badge>;
        }
    };

    const contacts: MappedContact[] = isContactsError || !apiContacts ? [] : apiContacts.map((c: ApiContact) => ({
        id: c.id,
        name: c.nama || c.contact_name || "Unknown",
        email: c.email || c.contact_email || "Unknown",
        status: c.status || c.send_status || "queued",
        isOpen: !!c.opened_at || c.is_open || false,
        isClicked: c.is_clicked || false, // Assuming clicked info might be available later
        sentAt: c.opened_at ? new Date(c.opened_at).toLocaleString('id-ID') : (c.sent_at || "-")
    }));

    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

    const filteredContacts = contacts.filter((c) =>
        c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(contactSearch.toLowerCase())
    );

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
                {contacts.length > 0 && (
                    <div className="p-6 flex flex-col">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Contact Tracking
                                    {isContactsLoading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                                    {selectedCampaign && (
                                        <Badge variant="secondary" className="ml-2 font-normal">
                                            Campaign: {selectedCampaign.name}
                                        </Badge>
                                    )}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Detailed tracking of individual contacts for the selected campaign.</p>
                            </div>
                            <DebouncedSearchInput
                                value={contactSearch}
                                onChange={setContactSearch}
                                placeholder="Search contact..."
                            />
                        </div>

                        <div className="bg-white border rounded shadow-sm overflow-hidden flex flex-col">
                            <div className="overflow-auto">
                                <BaseTable
                                    columns={[
                                        { title: "Contact Name", key: "name" },
                                        { title: "Email", key: "email" },
                                        { title: "Status", key: "status" },
                                        { title: "Opened", key: "isOpen", className: "text-center" },
                                        { title: "Clicked", key: "isClicked", className: "text-center" },
                                        { title: "Sent Time", key: "sentAt", className: "text-right" }
                                    ]}
                                    data={filteredContacts}
                                    isLoading={isContactsLoading}
                                    renderBody={(data) => (
                                        <>
                                            {data.map((contact: MappedContact) => (
                                                <TableRow key={contact.id} className="hover:bg-slate-50">
                                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                                                    <TableCell>
                                                        {contact.status === 'sent' ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Sent</Badge>
                                                        ) : contact.status === 'failed' ? (
                                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Failed</Badge>
                                                        ) : (
                                                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Queued</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {contact.isOpen ? (
                                                            <div className="flex justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                                                        ) : (
                                                            <div className="flex justify-center"><XCircle className="w-5 h-5 text-slate-300" /></div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {contact.isClicked ? (
                                                            <div className="flex justify-center"><MousePointerClick className="w-5 h-5 text-blue-500" /></div>
                                                        ) : (
                                                            <div className="flex justify-center"><XCircle className="w-5 h-5 text-slate-300" /></div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground">{contact.sentAt}</TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

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
                                    { title: "Campaign Name", key: "name" },
                                    { title: "Target Segment", key: "segment" },
                                    { title: "Status", key: "status" },
                                    { title: "Date", key: "date" },
                                    { title: "Open Rate", key: "openRate", className: "text-right" },
                                    { title: "Click Rate", key: "clickRate", className: "text-right" }
                                ]}
                                data={paginatedCampaigns}
                                isLoading={isCampaignsLoading}
                                renderBody={(data) => (
                                    <>
                                        {data.map((campaign: MappedCampaign) => (
                                            <TableRow
                                                key={campaign.id}
                                                className={`cursor-pointer ${selectedCampaignId === campaign.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-slate-50'}`}
                                                onClick={() => setSelectedCampaignId(campaign.id)}
                                            >
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
                                                <TableCell className="text-muted-foreground">
                                                    {campaign.date ? new Date(campaign.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                                </TableCell>
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
                                            </TableRow>
                                        ))}
                                    </>
                                )}
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
