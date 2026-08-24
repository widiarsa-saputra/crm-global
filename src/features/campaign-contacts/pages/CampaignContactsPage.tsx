import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MousePointerClick, CheckCircle2, XCircle, Users, Percent, FileText, Edit, Play, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useIndexCampaign } from "@/services/campaign";
import { privateApi } from "@/api/api";
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';

const CampaignContactsPage: React.FC = () => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number>(1);
    const [campaignPage, setCampaignPage] = useState(1);
    const [campaignItemsPerPage, setCampaignItemsPerPage] = useState(10);
    const [contactSearch, setContactSearch] = useState('');
    const [campaignSearch, setCampaignSearch] = useState('');

    // Mock Data for Blast Campaigns (Bottom Table)
    const mockCampaigns = [
        { id: 1, name: "Promo Ramadhan 2026", segment: "VIP & Hot Leads", date: "2026-03-10 10:00", status: "scheduled" as const, openRate: 0, clickRate: 0 },
        { id: 2, name: "Product Update v2.5", segment: "All Active Users", date: "2026-02-15 14:30", status: "completed" as const, openRate: 45.2, clickRate: 12.5 },
        { id: 3, name: "Re-engagement Campaign", segment: "Inactive", date: "2026-01-20 09:00", status: "completed" as const, openRate: 18.4, clickRate: 3.2 },
    ];

    // Mock Data for Campaign Contacts (Top Table)
    const mockContacts = [
        { id: 101, name: "Budi Santoso", email: "budi@example.com", status: "sent", isOpen: true, isClicked: true, sentAt: "2026-02-15 14:31" },
        { id: 102, name: "Siti Aminah", email: "siti@example.com", status: "sent", isOpen: true, isClicked: false, sentAt: "2026-02-15 14:31" },
        { id: 103, name: "Agus Pratama", email: "agus@example.com", status: "failed", isOpen: false, isClicked: false, sentAt: "-" },
        { id: 104, name: "Dewi Lestari", email: "dewi@example.com", status: "sent", isOpen: false, isClicked: false, sentAt: "2026-02-15 14:32" },
        { id: 105, name: "Joko Anwar", email: "joko@example.com", status: "sent", isOpen: true, isClicked: true, sentAt: "2026-02-15 14:32" },
    ];

    // API Query for Master Campaign List
    const { data: apiCampaignsRes, isError: isCampaignsError, isLoading: isCampaignsLoading } = useIndexCampaign();
    const apiCampaigns = apiCampaignsRes?.data || [];

    // API Query for Campaign Contacts Details
    const { data: apiContacts, isError: isContactsError, isLoading: isContactsLoading } = useQuery({
        queryKey: ['campaign-contacts', selectedCampaignId],
        queryFn: () => privateApi.get(`/v1/campaigns/${selectedCampaignId}/contacts`).then(res => res.data.data),
        retry: 1
    });

    const campaigns = isCampaignsError || !apiCampaigns ? mockCampaigns : apiCampaigns.map((c: any) => ({
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

    const contacts = isContactsError || !apiContacts ? mockContacts : apiContacts.map((c: any) => ({
        id: c.id,
        name: c.contact_name || "Unknown",
        email: c.contact_email || "Unknown",
        status: c.status,
        isOpen: c.is_open,
        isClicked: c.is_clicked,
        sentAt: c.sent_at || "-"
    }));

    const selectedCampaign = campaigns.find((c: any) => c.id === selectedCampaignId);

    const filteredContacts = contacts.filter((c: any) =>
        c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(contactSearch.toLowerCase())
    );

    const filteredCampaigns = campaigns.filter((c: any) =>
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

                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead>Contact Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Opened</TableHead>
                                        <TableHead className="text-center">Clicked</TableHead>
                                        <TableHead className="text-right">Sent Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredContacts.map((contact: any) => (
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
                                </TableBody>
                            </Table>
                        </div>
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
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-auto flex-1">
                            <Table>
                                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead>Campaign Name</TableHead>
                                        <TableHead>Target Segment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Open Rate</TableHead>
                                        <TableHead className="text-right">Click Rate</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCampaigns.map((campaign: any) => (
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
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={(e) => e.stopPropagation()}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={(e) => e.stopPropagation()}>
                                                                <Play className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                                            View Report
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
