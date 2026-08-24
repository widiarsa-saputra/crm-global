import { UseFormReturn, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import LabelComp from '@/components/LabelComp';
import { TryoutSubtestCreatePayload, SubtestScoringSystemEnum } from '@/services/tryout-subtests';

import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { useTryoutIndex } from '@/services/tryouts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    form: UseFormReturn<TryoutSubtestCreatePayload>;
}

const TryoutSubtestMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, formState: { errors } } = form;
    const [tryoutSearch, setTryoutSearch] = useState('');
    const { data: tryoutResponse, isLoading: tryoutLoading } = useTryoutIndex({ search: tryoutSearch });

    const tryouts = tryoutResponse?.data ?? [];
    const tryoutOptions = tryouts.map(t => ({
        label: t.title ?? '',
        value: t.id.toString(),
    }));

    return (
        <form
            className="flex flex-col gap-4"
            id="tryout-subtest-form"
        >
            {/* Tryout FK */}
            <div>
                <Controller
                    control={control}
                    name="tryout_id"
                    render={({ field }) => (
                        <SearchableSelect
                            options={tryoutOptions}
                            value={field.value?.toString() || ''}
                            onChange={(val) => field.onChange(val || null)}
                            placeholder="Pilih tryout"
                            serverSideSearch
                            searchValue={tryoutSearch}
                            onSearchChange={setTryoutSearch}
                            isPending={tryoutLoading}
                        />
                    )}
                />
                {errors.tryout_id && (
                    <span className="text-red-500 text-xs">{errors.tryout_id.message as string}</span>
                )}
            </div>

            {/* Nama */}
            <div>
                <LabelComp required>Judul Sub-tes</LabelComp>
                <Input type="text" {...register('title')} placeholder="Contoh: Penalaran Umum" />
                {errors.title && (
                    <span className="text-red-500 text-xs">{errors.title.message as string}</span>
                )}
            </div>

            {/* Urutan */}
            <div>
                <LabelComp required>Nomor Urut</LabelComp>
                <Input type="number" {...register('order', { valueAsNumber: true })} />
                {errors.order && (
                    <span className="text-red-500 text-xs">{errors.order.message as string}</span>
                )}
            </div>

            {/* Durasi */}
            <div>
                <LabelComp required>Durasi (menit)</LabelComp>
                <Input type="number" min={1} {...register('duration_minutes')} placeholder="Contoh: 30" />
                {errors.duration_minutes && <span className="text-red-500 text-xs">{errors.duration_minutes.message as string}</span>}
            </div>

            {/* Scoring System */}
            <div>
                <LabelComp required>Sistem Penilaian</LabelComp>
                <Controller
                    control={control}
                    name="scoring_system"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Pilih sistem penilaian" />
                            </SelectTrigger>
                            <SelectContent>
                                {SubtestScoringSystemEnum.map(s => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.scoring_system && <span className="text-red-500 text-xs">{errors.scoring_system.message as string}</span>}
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <LabelComp>Poin Benar</LabelComp>
                    <Input type="number" step="0.1" {...register('correct_point')} />
                    {errors.correct_point && <span className="text-red-500 text-xs">{errors.correct_point.message as string}</span>}
                </div>
                <div className="flex-1">
                    <LabelComp>Poin Salah</LabelComp>
                    <Input type="number" step="0.1" {...register('wrong_point')} />
                    {errors.wrong_point && <span className="text-red-500 text-xs">{errors.wrong_point.message as string}</span>}
                </div>
                <div className="flex-1">
                    <LabelComp>Poin Kosong</LabelComp>
                    <Input type="number" step="0.1" {...register('empty_point')} />
                    {errors.empty_point && <span className="text-red-500 text-xs">{errors.empty_point.message as string}</span>}
                </div>
            </div>

            <div>
                <LabelComp>Passing Grade</LabelComp>
                <Input type="number" step="0.1" {...register('passing_grade')} />
                {errors.passing_grade && <span className="text-red-500 text-xs">{errors.passing_grade.message as string}</span>}
            </div>
        </form>
    );
};

export default TryoutSubtestMutationForm;
