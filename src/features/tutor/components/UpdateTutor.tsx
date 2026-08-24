import React, { useEffect } from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useTutorUpdate, TutorEntity } from '@/services/tutors';
import { TutorCreateSchema, TutorCreatePayload } from '@/services/tutors/schema/TutorSchema';
import { TutorMutationForm } from '.';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
    tutor: TutorEntity | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdateTutor: React.FC<Props> = ({ tutor, open, onOpenChange }) => {
    const mutation = useTutorUpdate();
    const form = useForm<TutorCreatePayload>({
        resolver: zodResolver(TutorCreateSchema),
    });

    useEffect(() => {
        if (open && tutor) {
            form.reset({
                name: tutor.name ?? '',
                email: tutor.email ?? '',
                phone: tutor.phone ?? '',
                address: tutor.address ?? '',
                description: tutor.description ?? '',
            });
            mutation.reset();
        }
    }, [open, tutor]);

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Tutor"
            description="Perbarui informasi data tutor."
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button disabled={mutation.isPending} form='tutor-form' type='submit'>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            }
        >
            <TutorMutationForm form={form} />
        </Modal>
    );
};

export default UpdateTutor;
