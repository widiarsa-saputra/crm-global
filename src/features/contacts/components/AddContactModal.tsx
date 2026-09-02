import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useCreateContact } from '@/services/contacts/hooks/useContactsCRUD';
import { CreateContactSchema, CreateContact } from '@/services/contacts/schema/ContactsSchema';
import { ContactMutationForm } from './ContactMutationForm';
import { SubmitLoading } from '@/components/SubmitLoading';

interface AddContactModalProps {
    trigger?: React.ReactNode;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const createContactMutation = useCreateContact();

    const form = useForm<CreateContact>({
        resolver: zodResolver(CreateContactSchema),
        defaultValues: {
            nama: '',
            email: '',
            company: '',
            segment_id: null,
            email_status: 'valid',
        },
    });

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
        }
    };

    const onSubmit = (data: CreateContact) => {
        createContactMutation.mutate(data, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            },
        });
    };

    return (
        <>
            <Modal
                open={isOpen}
                onOpenChange={handleOpenChange}
                trigger={trigger}
                title="Add New Contact"
                description="Create a new contact and assign them to a segment."
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={createContactMutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" form="add-contact-form" disabled={createContactMutation.isPending}>
                            {createContactMutation.isPending ? 'Saving...' : 'Save Contact'}
                        </Button>
                    </div>
                }
            >
                <ContactMutationForm
                    formId="add-contact-form"
                    form={form}
                    onSubmit={onSubmit}
                />
            </Modal>
            <SubmitLoading mutation={createContactMutation} successMessage="Contact berhasil dibuat!" errorMessage="Gagal membuat contact!" />
        </>
    );
};
