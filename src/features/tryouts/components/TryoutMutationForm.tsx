import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelComp from '@/components/LabelComp';
import { TryoutCreatePayload } from '@/services/tryouts';

interface Props {
    form: UseFormReturn<TryoutCreatePayload>;
}

const TryoutMutationForm: React.FC<Props> = ({ form }) => {
    const { register, formState: { errors } } = form;

    return (
        <form
            className="flex flex-col gap-4"
            id="tryout-form"
        >
            {/* Judul */}
            <div>
                <LabelComp required>Judul Tryout</LabelComp>
                <Input type="text" {...register('title')} placeholder="Masukkan judul tryout" />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message as string}</span>}
            </div>

            {/* Deskripsi */}
            <div>
                <LabelComp>Deskripsi</LabelComp>
                <Textarea {...register('description')} placeholder="Panduan teknis pengerjaan" rows={3} />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
            </div>

            {/* Default Max Attempts */}
            <div>
                <LabelComp>Default Max Attempts</LabelComp>
                <Input type="number" {...register('default_max_attempts')} placeholder="0 (Tak terbatas)" min={0} />
                {errors.default_max_attempts && <span className="text-red-500 text-xs">{errors.default_max_attempts.message as string}</span>}
            </div>

            {/* Status Aktif */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Aktif</label>
            </div>

            {/* Status Publish */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_published"
                    {...register('is_published')}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_published" className="text-sm font-medium">Publikasikan Tryout</label>
            </div>
        </form>
    );
};

export default TryoutMutationForm;
