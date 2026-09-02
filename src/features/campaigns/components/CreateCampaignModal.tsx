
import React from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { CampaignMutationForm } from './CampaignMutationForm';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCampaignSchema, CreateCampaignPayload } from '@/services/campaign/schema/CampaignSchema';
import { useCreateCampaign } from '@/services/campaign/hooks/useCampaignCRUD';
import { isPastDateTime } from '@/lib/utils';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose }) => {
    const mutation = useCreateCampaign();

    const form = useForm<CreateCampaignPayload>({
        resolver: zodResolver(CreateCampaignSchema) as unknown as Resolver<CreateCampaignPayload>,
        defaultValues: {
            campaign_name: '',
            email_subject: '',
            date: '',
            time: '',
            timezone: '',
            message: '',
            target_segment_id: null,
            campaign_contacts: [],
            status: 'draft',
        },
    });

    const onSubmit = (data: CreateCampaignPayload) => {
        mutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };

    const pastDateTime = isPastDateTime(form.watch('date') ?? '', form.watch('time') ?? '');

    return (
        <Modal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Create New Campaign"
            size='2xl'
            description="Set up a new email campaign to engage with your contacts."
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="create-campaign-form" disabled={mutation.isPending || pastDateTime}>
                        {mutation.isPending ? 'Creating...' : 'Create Campaign'}
                    </Button>
                </div>
            }
        >
            <CampaignMutationForm
                formId="create-campaign-form"
                form={form}
                onSubmit={onSubmit}
                mutation={mutation}
            />
        </Modal>
    );
};
