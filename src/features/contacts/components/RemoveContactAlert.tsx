import React from 'react';
import AlertDialog from '@/shared/components/alert-dialog/AlertDialog';
import { useDeleteContact } from '@/services/contacts/hooks/useContactsCRUD';
import { SingleContactResponse } from '@/services/contacts';

interface RemoveContactAlertProps {
    contact: SingleContactResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export const RemoveContactAlert: React.FC<RemoveContactAlertProps> = ({ contact, isOpen, onClose }) => {
    const { mutate: deleteContact, isPending } = useDeleteContact();

    const handleConfirm = () => {
        if (!contact) return;
        deleteContact({ id: contact.id.toString() }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    if (!contact) return null;

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Delete Contact"
            description={`Are you sure you want to delete ${contact.nama}? This action cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleConfirm}
            onCancel={onClose}
            isLoading={isPending}
        />
    );
};
