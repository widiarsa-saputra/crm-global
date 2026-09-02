import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useUpdateContact } from '@/services/contacts/hooks/useContactsCRUD';
import { UpdateContactSchema, UpdateContact, statusEmailType } from '@/services/contacts/schema/ContactsSchema';
import { SingleContactResponse } from '@/services/contacts';
import { ContactMutationForm } from './ContactMutationForm';
import { SubmitLoading } from '@/components/SubmitLoading';

interface EditContactModalProps {
    contact?: SingleContactResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

type StatusEmail = typeof statusEmailType[number];

export const EditContactModal: React.FC<EditContactModalProps> = ({ contact, isOpen, onClose }) => {
    const updateContactMutation = useUpdateContact();

    const form = useForm<UpdateContact>({
        resolver: zodResolver(UpdateContactSchema),
        defaultValues: {
            nama: contact?.nama || '',
            email: contact?.email || '',
            company: contact?.company || '',
            segment_id: contact?.segment_id ? contact.segment_id.toString() : null,
            email_status: contact?.email_status as StatusEmail || 'valid',
        },
    });

    useEffect(() => {
        if (isOpen && contact) {
            form.reset({
                nama: contact.nama,
                email: contact.email,
                company: contact.company || '',
                segment_id: contact.segment_id ? contact.segment_id.toString() : null,
                email_status: contact.email_status as StatusEmail || 'valid',
            });
        }
    }, [isOpen, contact, form]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const onSubmit = (data: UpdateContact) => {
        updateContactMutation.mutate({ id: contact?.id ?? '', data }, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <>
            <Modal
                open={isOpen}
                onOpenChange={handleOpenChange}
                title="Edit Contact"
                description="Update the contact's details."
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={updateContactMutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" form="edit-contact-form" disabled={updateContactMutation.isPending}>
                            {updateContactMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <ContactMutationForm
                    formId="edit-contact-form"
                    form={form}
                    onSubmit={onSubmit}
                />
            </Modal>
            <SubmitLoading mutation={updateContactMutation} successMessage="Contact berhasil disimpan!" errorMessage="Gagal menyimpan contact!" />
        </>
    );
};
