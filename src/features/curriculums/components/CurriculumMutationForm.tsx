import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { CurriculumCreatePayload } from '@/services/curriculums';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useTryoutIndex } from '@/services/tryouts';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<CurriculumCreatePayload>;
}

const CurriculumMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [tryoutSearch, setTryoutSearch] = useState('');
    const debouncedTryoutSearch = useDebounce(tryoutSearch, 500);
    const { data: tryoutResp } = useTryoutIndex({ search: debouncedTryoutSearch, paginate: 30 });
    const tryoutOptions = (tryoutResp?.data ?? []).map(t => ({ label: t.title ?? String(t.id), value: String(t.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="curriculums-form">
            

            <FloatingInput
                id="title"
                label="Judul"
                watch={watch('title')}
                error={errors.title?.message}
                inputProps={{
                    ...register('title')
                }}
                required
            />

            <FloatingTextArea
                id="description"
                label="Deskripsi"
                watch={watch('description') || ''}
                error={errors.description?.message}
                inputProps={{
                    ...register('description'),
                    rows: 3
                }}
            />

            <FloatingInput
                id="duration"
                type="number"
                label="Durasi (Menit)"
                watch={watch('duration')?.toString()}
                error={errors.duration?.message}
                inputProps={{
                    ...register('duration'),
                    min: 0
                }}
            />

            <Controller
                control={control}
                name="tryout_id"
                render={({ field }) => (
                    <Combobox
                        id="tryout_id"
                        label="Tryout"
                        options={tryoutOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setTryoutSearch}
                        error={errors.tryout_id?.message as string}
                        inputProps={{ placeholder: "Pilih Tryout..." }}
                    />
                )}
            />
        </form>
    );
};

export default CurriculumMutationForm;
