import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import LabelComp from '@/components/LabelComp';
import { Switch } from '@/components/ui/switch';
import { EnrollmentGroupCreatePayload } from '@/services/enrollment-groups';

interface Props {
    form: UseFormReturn<EnrollmentGroupCreatePayload>;
}

const EnrollmentGroupMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, formState: { errors } } = form;

    return (
        <form className="flex flex-col gap-4" id="enrollment-groups-form">

                <div>
                    <LabelComp>Tutor ID</LabelComp>
                    <Input type="text" {...register('tutor_id')} placeholder="Masukkan Tutor ID" />
                    {errors.tutor_id && <span className="text-red-500 text-xs">{errors.tutor_id.message as string}</span>}
                </div>

                <div>
                    <LabelComp>Nama</LabelComp>
                    <Input type="text" {...register('name')} placeholder="Masukkan Nama" />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <Controller
                        control={control}
                        name="can_request_tutoring"
                        render={({ field }) => (
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <LabelComp className="mb-0">Can Request Tutoring?</LabelComp>
                </div>
                {errors.can_request_tutoring && <span className="text-red-500 text-xs">{errors.can_request_tutoring.message as string}</span>}
        </form>
    );
};

export default EnrollmentGroupMutationForm;
