import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useUpdateContact } from '@/services/contacts/hooks/useContactsCRUD';
import { SingleContactResponse, statusEmailType } from '@/services/contacts';
import Combobox from '@/components/Combobox';
import { ShieldCheck } from 'lucide-react';

interface UpdateStatusModalProps {
    contact?: SingleContactResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

const emailStatusOptions = [
    { label: 'Valid', value: 'valid' },
    { label: 'Unsubscribed', value: 'unsubscribed' },
    { label: 'Blocked', value: 'blocked' },
];

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ contact, isOpen, onClose }) => {
    const { mutate: updateContact, isPending } = useUpdateContact();
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && contact) {
            setSelectedStatus(contact.email_status);
        }
    }, [isOpen, contact]);

    const handleConfirm = () => {
        if (!contact) return;
        updateContact({ 
            id: contact?.id ?? '',
            data: { email_status: selectedStatus as (typeof statusEmailType)[number] } 
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };



    return (
        <Modal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Update Status"
            description={`Change email status for ${contact?.nama ?? ''}`}
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={isPending}>
                        {isPending ? 'Updating...' : 'Update Status'}
                    </Button>
                </div>
            }
        >
            <div className="py-4">
                <Combobox
                    id="update_status"
                    label="Select New Status"
                    icon={ShieldCheck}
                    options={emailStatusOptions}
                    value={selectedStatus}
                    onChange={(option) => setSelectedStatus(option.value)}
                />
            </div>
        </Modal>
    );
};
