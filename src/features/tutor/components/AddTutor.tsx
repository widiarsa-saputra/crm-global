import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTutorCreate, TutorCreateSchema, TutorCreatePayload } from '@/services/tutors';
import { TutorMutationForm } from '.';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const AddTutor: React.FC = () => {
    const [open, setOpen] = useState(false);
    const mutation = useTutorCreate();
    const form = useForm<TutorCreatePayload>({
        resolver: zodResolver(TutorCreateSchema),
    });

    useEffect(() => {
        if (open) {
            form.reset();
            mutation.reset();
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title="Tambah Tutor"
            description="Isi form di bawah ini untuk menambahkan data tutor baru."
            trigger={
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Tutor
                </Button>
            }
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button disabled={mutation.isPending} form='tutor-form' type='submit'>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            }
        >
            <TutorMutationForm form={form} />
        </Modal>
    );
};

export default AddTutor;
