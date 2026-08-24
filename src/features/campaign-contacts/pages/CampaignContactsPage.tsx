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
import { Search, Eye, MousePointerClick, CheckCircle2, XCircle, ArrowUpRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { campaignService } from '@/services/campaign';
import { campaignContactService } from '@/services/campaign-contact';

const CampaignContactsPage: React.FC = () => {
    // State to hold the currently selected campaign ID
    const [selectedCampaignId, setSelectedCampaignId] = useState<number>(1);

    // Mock Data for Blast Campaigns (Bottom Table)
    const mockCampaigns = [
        { id: 1, name: "Promo Ramadhan 2026", segment: "VIP & Hot Leads", date: "2026-03-10 10:00", openRate: 0, clickRate: 0 },
        { id: 2, name: "Product Update v2.5", segment: "All Active Users", date: "2026-02-15 14:30", openRate: 45.2, clickRate: 12.5 },
        { id: 3, name: "Re-engagement Campaign", segment: "Inactive", date: "2026-01-20 09:00", openRate: 18.4, clickRate: 3.2 },
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
    const { data: apiCampaigns, isError: isCampaignsError, isLoading: isCampaignsLoading } = useQuery({
        queryKey: ['campaigns'],
        queryFn: campaignService.getAll,
        retry: 1
    });

    // API Query for Campaign Contacts Details
    const { data: apiContacts, isError: isContactsError, isLoading: isContactsLoading } = useQuery({
        queryKey: ['campaign-contacts', selectedCampaignId],
        queryFn: () => campaignContactService.getByCampaignId(selectedCampaignId),
        retry: 1
    });

    const campaigns = isCampaignsError || !apiCampaigns ? mockCampaigns : apiCampaigns.map(c => ({
        id: c.id,
        name: c.campaign_name,
        segment: c.segment_name || "Unknown Segment",
        date: c.date,
        openRate: c.open_rate,
        clickRate: c.click_rate
    }));

    const contacts = isContactsError || !apiContacts ? mockContacts : apiContacts.map(c => ({
        id: c.id,
        name: c.contact_name || "Unknown",
        email: c.contact_email || "Unknown",
        status: c.status,
        isOpen: c.is_open,
        isClicked: c.is_clicked,
        sentAt: c.sent_at || "-"
    }));

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

    return (
        <AdminLayout>
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* TOP SECTION: Campaign Contacts Detail */}
                <div className="flex-1 p-6 flex flex-col min-h-[400px]">
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
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search contact..." className="pl-8 bg-white h-9" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="overflow-auto flex-1">
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
                                    {contacts.map((contact) => (
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
                <div className="h-[35%] border-t bg-white flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                        <h3 className="font-semibold flex items-center gap-2">
                            Select Campaign to View
                            {isCampaignsLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search campaign..." className="pl-8 bg-white h-8 text-sm" />
                        </div>
                    </div>
                    <div className="overflow-auto flex-1">
                        <Table>
                            <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
                                <TableRow>
                                    <TableHead>Campaign Name</TableHead>
                                    <TableHead>Target Segment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Open Rate</TableHead>
                                    <TableHead className="text-right">Click Rate</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.map((campaign) => (
                                    <TableRow 
                                        key={campaign.id} 
                                        className={`cursor-pointer ${selectedCampaignId === campaign.id ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-slate-50'}`}
                                        onClick={() => setSelectedCampaignId(campaign.id)}
                                    >
                                        <TableCell className="font-medium">{campaign.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{campaign.segment}</TableCell>
                                        <TableCell className="text-muted-foreground">{campaign.date}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">{campaign.openRate}%</TableCell>
                                        <TableCell className="text-right font-medium text-blue-600">{campaign.clickRate}%</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8">
                                                View Details <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CampaignContactsPage;
