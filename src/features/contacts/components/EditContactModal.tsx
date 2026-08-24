import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useUpdateContact } from '@/services/contacts/hooks/useContactsCRUD';
import { UpdateContactSchema, UpdateContact } from '@/services/contacts/schema/ContactsSchema';
import { SingleContactResponse } from '@/services/contacts';
import { ContactMutationForm } from './ContactMutationForm';

interface EditContactModalProps {
    contact: SingleContactResponse;
    isOpen: boolean;
    onClose: () => void;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({ contact, isOpen, onClose }) => {
    const { mutate: updateContact, isPending } = useUpdateContact();
    
    const form = useForm<UpdateContact>({
        resolver: zodResolver(UpdateContactSchema),
        defaultValues: {
            nama: contact?.nama || '',
            email: contact?.email || '',
            company: contact?.company || '',
            segment_id: contact?.segment_id ? contact.segment_id.toString() : null,
            email_status: contact?.email_status || 'valid',
        },
    });

    useEffect(() => {
        if (isOpen && contact) {
            form.reset({
                nama: contact.nama,
                email: contact.email,
                company: contact.company || '',
                segment_id: contact.segment_id ? contact.segment_id.toString() : null,
                email_status: contact.email_status || 'valid',
            });
        }
    }, [isOpen, contact, form]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const onSubmit = (data: UpdateContact) => {
        updateContact({ id: contact.id, data }, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!contact) return null;

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleOpenChange}
            title="Edit Contact"
            description="Update the contact's details."
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-contact-form" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            }
        >
            <ContactMutationForm formId="edit-contact-form" form={form} onSubmit={onSubmit} />
        </Modal>
    );
};
