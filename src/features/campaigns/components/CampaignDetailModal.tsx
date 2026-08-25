import React from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { SingleCampaignResponse } from '@/services/campaign';
import { Users, Send, MousePointerClick, MailOpen, Mail, AlignLeft, Tags } from 'lucide-react';
import { BaseTable, Column } from '@/shared/components/table/BaseTable';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';
import DOMPurify from 'dompurify';

interface CampaignDetailModalProps {
    campaign: SingleCampaignResponse;
    isOpen: boolean;
    onClose: () => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, isOpen, onClose }) => {
    
    // We'll calculate some mock numbers for display if they're not provided by the API
    const totalTarget = campaign.target_contacts ? campaign.target_contacts.length : 0;
    const totalSent = campaign.status === 'completed' || campaign.status === 'processing' ? totalTarget : 0;
    
    type CampaignTargetContact = NonNullable<SingleCampaignResponse['target_contacts']>[0];

    const contactColumns: Column<CampaignTargetContact>[] = [
        {
            title: "Email",
            key: "email",
            render: (contact) => (
                <div className="flex flex-col">
                    <span className="font-medium">{contact.email}</span>
                    <span className="text-xs text-muted-foreground">{contact.nama}</span>
                </div>
            )
        },
        {
            title: "Status Pengiriman",
            key: "status" as keyof CampaignTargetContact,
            render: (contact) => {
                const status = contact.status || 'Pending';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        status.toLowerCase() === 'sent' ? 'bg-green-100 text-green-700' :
                        status.toLowerCase() === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                        {status}
                    </span>
                );
            }
        },
        {
            title: "Waktu Dibuka",
            key: "opened_at" as keyof CampaignTargetContact,
            render: (contact) => {
                if (!contact.opened_at) return <span className="text-muted-foreground">-</span>;
                
                const openDate = new Date(contact.opened_at);
                if (isNaN(openDate.getTime())) return <span className="text-muted-foreground">-</span>;

                const today = new Date();
                const isToday = openDate.getDate() === today.getDate() && 
                                openDate.getMonth() === today.getMonth() && 
                                openDate.getFullYear() === today.getFullYear();
                
                const dateStr = isToday ? "Hari ini" : openDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const timeWithTz = openDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
                
                return <span>{dateStr}, {timeWithTz.replace('.', ':')}</span>;
            }
        }
    ];

    return (
        <Modal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={`Campaign Report: ${campaign.campaign_name}`}
            description={`Blast will be executed on ${new Date(campaign.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) || '-'} at ${campaign.time || '-'} (${campaign.timezone || '-'})`}
            size='xl'
        >
            <div className="flex flex-col gap-6 py-4">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 border p-4 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Total Target</p>
                            <h3 className="text-2xl font-bold">{totalTarget}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 border p-4 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                            <Send className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Total Sent</p>
                            <h3 className="text-2xl font-bold">{totalSent}</h3>
                        </div>
                    </div>

                    <div className="bg-slate-50 border p-4 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <MailOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Open Rate</p>
                            <h3 className="text-2xl font-bold">{campaign.open_rate}%</h3>
                        </div>
                    </div>

                    <div className="bg-slate-50 border p-4 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <MousePointerClick className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Click Rate</p>
                            <h3 className="text-2xl font-bold">{campaign.click_rate}%</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Campaign Information Section */}
                    <div className="bg-white border rounded-xl overflow-hidden">
                        <div className="bg-slate-50 border-b px-4 py-3 font-semibold text-slate-700">
                            Campaign Information
                        </div>
                        <div className="p-4 grid gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email Subject</span>
                                <span className="font-medium bg-slate-50 p-2 rounded border">{campaign.email_subject || '-'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Tags className="w-4 h-4" /> Target Segment</span>
                                <span className="font-medium bg-slate-50 p-2 rounded border">{campaign.segment_name || 'All Contacts'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><AlignLeft className="w-4 h-4" /> Template Message</span>
                                <div className="font-medium bg-slate-50 rounded border min-h-[100px] text-sm overflow-hidden">
                                    {campaign.template_message ? (
                                        <ReactQuill 
                                            value={DOMPurify.sanitize(campaign.template_message)}
                                            readOnly={true}
                                            theme="bubble"
                                        />
                                    ) : (
                                        <div className="p-3">
                                            <span className="text-muted-foreground italic">No template message available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Target Contacts Table Section */}
                    <div className="bg-white border rounded-xl overflow-hidden flex flex-col h-full min-h-[400px]">
                        <div className="bg-slate-50 border-b px-4 py-3 font-semibold text-slate-700 shrink-0">
                            Target Contacts List
                        </div>
                        <div className="overflow-auto flex-1 max-h-[500px]">
                            {campaign.target_contacts && campaign.target_contacts.length > 0 ? (
                                <BaseTable 
                                    columns={contactColumns} 
                                    data={campaign.target_contacts} 
                                    className="border-none"
                                />
                            ) : (
                                <div className="p-8 text-center text-muted-foreground h-full flex items-center justify-center">
                                    No target contacts found for this campaign.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
        </Modal>
    );
};
