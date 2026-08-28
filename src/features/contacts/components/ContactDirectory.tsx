import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DebouncedSearchInput from '@/shared/components/search/DebouncedSearchInput';
import { Plus, Building, Trash2, Edit2, Loader2, Users, MapPin, Phone, Mail, Upload, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
    useIndexContact,
    useImportContacts,
    downloadContactTemplate,
    downloadImportResult
} from '@/services/contacts';
import { SingleContactResponse } from '@/services/contacts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddContactModal } from './AddContactModal';
import { EditContactModal } from './EditContactModal';
import { MoveSegmentModal } from './MoveSegmentModal';
import { RemoveContactAlert } from './RemoveContactAlert';
import { UpdateStatusModal } from './UpdateStatusModal';
import { BaseTable } from '@/shared/components/table/BaseTable';
import { getMetricColor } from '@/lib/utils';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import PrintJson from '@/lib/printjson';

interface ContactDirectoryProps {
    activeSegmentId: string | null;
}

export const ContactDirectory: React.FC<ContactDirectoryProps> = ({ activeSegmentId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState<SingleContactResponse | null>(null);
    const [dialog, setDialog] = useState<'edit' | 'move' | 'delete' | 'status' | null>(null);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [engagementRange, setEngagementRange] = useState<number[]>([0, 100]);
    const [committedEngagementRange, setCommittedEngagementRange] = useState<number[]>([0, 100]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    const handleOpenDialog = (type: 'edit' | 'move' | 'delete' | 'status', contact: SingleContactResponse) => {
        setSelectedContact(contact);
        setDialog(type);
    };

    const handleCloseDialog = () => {
        setDialog(null);
        setSelectedContact(null);
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { mutate: importContacts, isPending: isImporting } = useImportContacts();
    const [importAlertState, setImportAlertState] = useState<{
        open: boolean;
        status: 'success' | 'error' | null;
        downloadId?: string;
    }>({ open: false, status: null });

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        importContacts({ file }, {
            onSuccess: (data) => {
                setImportAlertState({
                    open: true,
                    status: 'success',
                    downloadId: data.data?.download_id
                });
            },
            onError: () => {
                setImportAlertState({
                    open: true,
                    status: 'error'
                });
            },
            onSettled: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        });
    };

    const {
        data: apiResponse,
        isLoading,
    } = useIndexContact({
        params: {
            'filter[segment_id]': activeSegmentId || undefined,
            'filter[min_engagement]': committedEngagementRange[0] !== 0 ? committedEngagementRange[0] : undefined,
            'filter[max_engagement]': committedEngagementRange[1] !== 100 ? committedEngagementRange[1] : undefined,
            search: searchTerm || undefined,
            paginate: itemsPerPage,
            page: currentPage,
            sort_by: sortBy,
            sort_order: sortOrder,
            include: 'segment',
        },
    });

    const totalItems = apiResponse?.pagination?.total || 0;


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'blocked': return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'unsubscribed': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
            case 'invalid': return 'bg-rose-100 text-rose-700 hover:bg-rose-100';
            case 'affiliated': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="flex-1 min-w-0 flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <header className="p-3 pl-4 pr-0 border-b flex items-center justify-between gap-x-4">
                <div className="flex gap-2">
                    <DebouncedSearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search name, email, or company..."
                        className="flex-1 min-w-[180px]"
                    />

                    <div className="hidden lg:flex items-center gap-3 px-4 shrink-0 mx-auto">
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap max-xl:hidden">Engagement</span>
                        <Slider
                            value={engagementRange}
                            onValueChange={setEngagementRange}
                            onValueCommit={setCommittedEngagementRange}
                            min={0}
                            max={100}
                            minStepsBetweenThumbs={1}
                            className="w-[100px] xl:w-[150px]"
                        />
                        <div className="text-xs font-medium w-14 text-center text-slate-600 whitespace-nowrap">
                            {engagementRange[0]}% - {engagementRange[1]}%
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleFileChange}
                    />
                    <Button variant="outline" onClick={() => downloadContactTemplate()} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="max-2xl:hidden">
                            Download Template
                        </span>
                    </Button>
                    <Button variant="outline" onClick={handleImportClick} disabled={isImporting} className='flex items-center gap-2'>
                        {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span className="max-2xl:hidden">

                            Import
                        </span>
                    </Button>

                    <AddContactModal
                        trigger={
                            <Button className='flex items-center gap-2'>
                                <Plus className="w-4 h-4" />
                                <span className="max-xl:hidden">
                                    Add Contact
                                </span>
                            </Button>
                        }
                    />
                </div>
            </header>

            {/* Table Content */}
            <div className="flex-1 p-4 pr-0 overflow-auto">
                <PrintJson data={apiResponse?.data ?? []} />

                <BaseTable
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={(key, order) => {
                        setSortBy(key);
                        setSortOrder(order);
                    }}
                    columns={[
                        {
                            title: "Contact",
                            key: "name",
                            sortKey: "nama",
                            sortable: true,
                            render: (c: SingleContactResponse) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">{c.nama || 'Unknown'}</span>
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: "email",
                            key: "email",
                            sortable: true,
                            render: (c: SingleContactResponse) => (
                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{c.email}</span>
                                </div>
                            )
                        },
                        {
                            title: "Engagement",
                            key: "engagement_rate",
                            className: "text-center",
                            sortable: true,
                            render: (c: SingleContactResponse) => <span className={`font-semibold ${getMetricColor(c.engagement_rate || 0)}`}>{c.engagement_rate}%</span>
                        },
                        {
                            title: "Company",
                            key: "company",
                            sortable: true,
                            render: (c: SingleContactResponse) => (
                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                    <Building className="w-3.5 h-3.5" />
                                    <span className="">{c.company || '-'}</span>
                                </div>
                            )
                        },
                        {
                            title: "Segment",
                            key: "segment_id",
                            sortable: true,
                            render: (c: SingleContactResponse) => {
                                if (c.segment) {
                                    return (
                                        <Badge
                                            title="Click to move segment"
                                            variant="secondary"
                                            className="font-medium bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors truncate max-w-full capitalize"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDialog('move', c)
                                            }}
                                        >
                                            {c.segment?.name}
                                        </Badge>
                                    )
                                }

                                return '-'
                            }
                        },
                        {
                            title: "Location",
                            key: "location",
                            render: (c: SingleContactResponse) => (
                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[150px]">{c.location || '-'}</span>
                                </div>
                            )
                        },

                        {
                            title: "Fax",
                            key: "fax",
                            render: (c: SingleContactResponse) => (
                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="truncate">{c.fax || '-'}</span>
                                </div>
                            )
                        },
                        {
                            title: "Sent",
                            key: "total_sended",
                            className: "text-center",
                            sortable: true,
                            render: (c: SingleContactResponse) => <span className="font-semibold text-slate-700">{c.total_sent} <span className="font-normal">mail</span></span>
                        },
                        {
                            title: "Opens",
                            key: "total_opens",
                            className: "text-center",
                            sortable: true,
                            render: (c: SingleContactResponse) => <span className={`font-semibold ${getMetricColor(c.total_opens || 0)}`}>{c.total_opens} <span className="font-normal">times</span></span>
                        },
                        {
                            title: "Clicks",
                            key: "total_clicks",
                            className: "text-center",
                            sortable: true,
                            render: (c: SingleContactResponse) => <span className={`font-semibold ${getMetricColor(c.total_clicks || 0)}`}>{c.total_clicks} <span className="font-normal">times</span></span>
                        },
                        {
                            title: "Status",
                            key: "email_status",
                            render: (c: SingleContactResponse) => (
                                <Badge
                                    title="Click to update email_status"
                                    className={`${getStatusColor(c.email_status)} cursor-pointer hover:opacity-80 transition-opacity`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // handleOpenDialog('email_status', c)
                                        // if (c._raw) handleOpenDialog('email_status', c._raw);
                                    }}
                                >
                                    {c.email_status}
                                </Badge>
                            )
                        },
                        {
                            title: "Action",
                            key: "action",
                            render: (c: SingleContactResponse) => (
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDialog('edit', c)
                                            // if (c._raw) handleOpenDialog('edit', c._raw);
                                        }}
                                        title="Edit Contact"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDialog('delete', c)
                                            // if (c._raw) handleOpenDialog('delete', c._raw);
                                        }}
                                        title="Delete Contact"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )
                        }
                    ]}
                    data={apiResponse?.data ?? []}
                    isLoading={isLoading}
                    emptyMessage={
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Belum ada kontak</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                {activeSegmentId === 'unassigned'
                                    ? "Semua kontak saat ini sudah memiliki segmen."
                                    : activeSegmentId
                                        ? "Tidak ada kontak di segmen ini. Silakan tambahkan atau pindahkan kontak ke sini."
                                        : "Anda belum memiliki kontak apa pun. Silakan tambahkan kontak baru untuk mulai."}
                            </p>
                        </div>
                    }
                />
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

            {selectedContact && (
                <>
                    <EditContactModal
                        contact={selectedContact}
                        isOpen={dialog === 'edit'}
                        onClose={handleCloseDialog}
                    />
                    <MoveSegmentModal
                        contact={selectedContact}
                        isOpen={dialog === 'move'}
                        onClose={handleCloseDialog}
                    />
                    <UpdateStatusModal
                        contact={selectedContact}
                        isOpen={dialog === 'status'}
                        onClose={handleCloseDialog}
                    />
                    <RemoveContactAlert
                        contact={selectedContact}
                        isOpen={dialog === 'delete'}
                        onClose={handleCloseDialog}
                    />
                </>
            )}

            <AlertDialog
                open={importAlertState.open}
                onOpenChange={(open) => !open && setImportAlertState(prev => ({ ...prev, open: false }))}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {importAlertState.status === 'success' ? 'Import Berhasil' : 'Import Gagal'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {importAlertState.status === 'success'
                                ? 'File import berhasil masuk antrean.'
                                : 'Terjadi kesalahan saat mengimpor file. Silakan unduh template yang benar dan coba lagi.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {importAlertState.status === 'success' ? (
                            <>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => importAlertState.downloadId && downloadImportResult(importAlertState.downloadId)}>
                                    Download
                                </AlertDialogAction>
                            </>
                        ) : (
                            <>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => downloadContactTemplate()}>
                                    Download Template
                                </AlertDialogAction>
                            </>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
