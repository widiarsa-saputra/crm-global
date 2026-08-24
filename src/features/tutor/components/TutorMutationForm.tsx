import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelComp from '@/components/LabelComp';
import { TutorCreatePayload } from '@/services/tutors/schema/TutorSchema';

interface Props {
    form: UseFormReturn<TutorCreatePayload>;
}

const TutorMutationForm: React.FC<Props> = ({ form }) => {
    const { register, formState: { errors } } = form;

    return (
        <form className="flex flex-col gap-4" id="tutor-form">
            <div>
                <LabelComp required>Nama Tutor</LabelComp>
                <Input {...register('name')} placeholder="Masukkan nama tutor" />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <LabelComp>Email</LabelComp>
                    <Input type="email" {...register('email')} placeholder="email@example.com" />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                </div>

                <div>
                    <LabelComp>No. Telepon</LabelComp>
                    <Input {...register('phone')} placeholder="0812..." />
                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message as string}</span>}
                </div>
            </div>

            <div>
                <LabelComp>Alamat</LabelComp>
                <Textarea {...register('address')} placeholder="Masukkan alamat lengkap" rows={2} />
                {errors.address && <span className="text-red-500 text-xs">{errors.address.message as string}</span>}
            </div>

            <div>
                <LabelComp required>Deskripsi</LabelComp>
                <Textarea {...register('description')} placeholder="Masukkan deskripsi tutor" rows={3} />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
            </div>
        </form>
    );
};

export default TutorMutationForm;
