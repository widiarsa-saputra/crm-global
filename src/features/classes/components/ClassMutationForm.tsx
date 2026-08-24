import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import LabelComp from '@/components/LabelComp';
import { ClassCreatePayload } from '../../../services/classes';
import { Switch } from '@/components/ui/switch';

interface Props {
    form: UseFormReturn<ClassCreatePayload>;
}

const ClassMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, formState: { errors } } = form;

    return (
        <form className="flex flex-col gap-4" id="class-form">
            <div>
                <LabelComp required>Nama Kelas</LabelComp>
                <Input {...register('name')} placeholder="Masukkan nama kelas" />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <LabelComp required>Status Kelas</LabelComp>
                <Controller
                    control={control}
                    name="is_active"
                    render={({ field }) => (
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={field.value === 'active'}
                                onCheckedChange={(checked) => field.onChange(checked ? 'active' : 'inactive')}
                            />
                            <span className="text-sm font-medium text-slate-700">
                                {field.value === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        </div>
                    )}
                />
            </div>
        </form>
    );
};

export default ClassMutationForm;
