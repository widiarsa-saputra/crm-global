import React from 'react';
import { createPortal } from 'react-dom';
import AlertDialog from '@/shared/components/alert-dialog/AlertDialog';
import { useDeleteContact } from '@/services/contacts/hooks/useContactsCRUD';
import { SingleContactResponse } from '@/services/contacts';
import { SubmitLoading } from '@/components/SubmitLoading';
import { useQueryClient, UseMutationResult } from '@tanstack/react-query';

interface RemoveContactAlertProps {
    contact: SingleContactResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export const RemoveContactAlert: React.FC<RemoveContactAlertProps> = ({ contact, isOpen, onClose }) => {
    const deleteContactMutation = useDeleteContact();
    const queryClient = useQueryClient();
    const [isAlertOpen, setIsAlertOpen] = React.useState(isOpen);

    React.useEffect(() => {
        setIsAlertOpen(isOpen);
    }, [isOpen]);

    const handleConfirm = () => {
        if (!contact) return;
        deleteContactMutation.mutate({ id: contact.id.toString() }, {
            onSuccess: () => {
                setIsAlertOpen(false);
                queryClient.invalidateQueries({ queryKey: ['contact-list'] });
                queryClient.invalidateQueries({ queryKey: ['contact-list-infinite'] });
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        });
    };

    return (
        <>
            {typeof window !== 'undefined' && document.body
                ? createPortal(
                      <div className="relative z-[100]">
                          <SubmitLoading 
                              mutation={deleteContactMutation as UseMutationResult}
                              successMessage="Contact berhasil dihapus"
                              errorMessage="Gagal menghapus contact"
                          />
                      </div>,
                      document.body
                  )
                : null}
            <AlertDialog
                open={isAlertOpen}
                onOpenChange={(open) => {
                    setIsAlertOpen(open);
                    if (!open) onClose();
                }}
                title="Delete Contact"
                description={`Are you sure you want to delete ${contact?.nama ?? 'this contact'}? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleConfirm}
                onCancel={onClose}
                isLoading={deleteContactMutation.isPending}
            />
        </>
    );
};
