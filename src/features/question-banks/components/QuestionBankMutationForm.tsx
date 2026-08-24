import { UseFormReturn, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelComp from '@/components/LabelComp';
import { QuestionBankCreatePayload, QuestionTypeEnum, DifficultyEnum } from '@/services/question-banks';
import { useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useLessonIndex } from '@/services/lessons/hooks/useLessonCRUD';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    form: UseFormReturn<QuestionBankCreatePayload>;
}

const QuestionBankMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, formState: { errors } } = form;




    const [lessonSearch, setLessonSearch] = useState('');
    const debouncedLessonSearch = useDebounce(lessonSearch, 500);

    const { data: lessonResponse, isLoading: isLoadingLessons } = useLessonIndex({
        search: debouncedLessonSearch,
        paginate: 30,
    });

    const lessons = lessonResponse?.data ?? [];
    const lessonOptions = lessons.map((lesson) => ({
        label: lesson.title ?? '',
        value: lesson.id.toString(),
    }));

    return (
        <form
            className="flex flex-col gap-4"
            id="question-bank-form"
            >
                {/* Lesson ID */}
                <div>
                    <LabelComp>Pelajaran (Lesson)</LabelComp>
                    <Controller
                        control={control}
                        name="lesson_id"
                        render={({ field }) => (
                            <SearchableSelect
                                options={lessonOptions}
                                value={field.value?.toString() || ""}
                                onChange={(val) => field.onChange(val || null)}
                                placeholder="Pilih Pelajaran (Opsional)"
                                serverSideSearch
                                searchValue={lessonSearch}
                                onSearchChange={setLessonSearch}
                                isPending={isLoadingLessons}
                            />
                        )}
                    />
                    {errors.lesson_id && <span className="text-red-500 text-xs">{errors.lesson_id.message as string}</span>}
                </div>

                {/* Tipe Soal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <LabelComp required>Tipe Soal</LabelComp>
                        <Controller
                            control={control}
                            name="question_type"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tipe Soal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {QuestionTypeEnum.map(t => (
                                            <SelectItem key={t} value={t}>
                                                {t === 'multiple_choice' ? 'Pilihan Ganda' : t === 'multiple_select' ? 'Multi Jawaban' : 'Esai'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.question_type && <span className="text-red-500 text-xs">{errors.question_type.message as string}</span>}
                    </div>

                    {/* Tingkat Kesulitan */}
                    <div>
                        <LabelComp required>Tingkat Kesulitan</LabelComp>
                        <Controller
                            control={control}
                            name="difficulty"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tingkat Kesulitan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DifficultyEnum.map(d => (
                                            <SelectItem key={d} value={d}>
                                                {d === 'easy' ? 'Mudah' : d === 'medium' ? 'Sedang' : d === 'hard' ? 'Sulit' : 'HOTS'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.difficulty && <span className="text-red-500 text-xs">{errors.difficulty.message as string}</span>}
                    </div>
                </div>

                {/* Teks Soal */}
                <div>
                    <LabelComp required>Teks Soal</LabelComp>
                    <Textarea
                        {...register('question_text')}
                        placeholder="Masukkan teks soal (mendukung teks biasa atau LaTeX)"
                        rows={4}
                    />
                    {errors.question_text && <span className="text-red-500 text-xs">{errors.question_text.message as string}</span>}
                </div>

                {/* URL Gambar Soal */}
                <div>
                    <LabelComp>URL Gambar Soal</LabelComp>
                    <Input
                        type="text"
                        {...register('question_image_url')}
                        placeholder="https://..."
                    />
                    {errors.question_image_url && <span className="text-red-500 text-xs">{errors.question_image_url.message as string}</span>}
                </div>

                <div className="p-3 bg-muted/40 rounded-md border text-sm text-muted-foreground mt-2">
                    Pilihan ganda dan kunci jawaban akan dikelola di tabel terpisah setelah soal dibuat.
                </div>

                {/* Pembahasan */}
                <div>
                    <LabelComp>Pembahasan</LabelComp>
                    <Textarea
                        {...register('explanation')}
                        placeholder="Masukkan pembahasan lengkap"
                        rows={3}
                    />
                    {errors.explanation && <span className="text-red-500 text-xs">{errors.explanation.message as string}</span>}
                </div>

                <div className="border-t my-4" />
                <h3 className="font-semibold mb-2">Item Response Theory (IRT) - Kalibrasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <LabelComp>Daya Pembeda (a)</LabelComp>
                        <Input type="number" step="0.01" {...register('item_discrimination_a')} placeholder="e.g. 1.2" />
                        {errors.item_discrimination_a && <span className="text-red-500 text-xs">{errors.item_discrimination_a.message as string}</span>}
                    </div>
                    <div>
                        <LabelComp>Tingkat Kesulitan (b)</LabelComp>
                        <Input type="number" step="0.01" {...register('item_difficulty_b')} placeholder="e.g. 0.5" />
                        {errors.item_difficulty_b && <span className="text-red-500 text-xs">{errors.item_difficulty_b.message as string}</span>}
                    </div>
                    <div>
                        <LabelComp>Tebakan (c)</LabelComp>
                        <Input type="number" step="0.01" {...register('item_guessing_c')} placeholder="e.g. 0.2" />
                        {errors.item_guessing_c && <span className="text-red-500 text-xs">{errors.item_guessing_c.message as string}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <LabelComp>Total Tested Attempts</LabelComp>
                        <Input type="number" {...register('total_tested_attempts')} placeholder="0" />
                        {errors.total_tested_attempts && <span className="text-red-500 text-xs">{errors.total_tested_attempts.message as string}</span>}
                    </div>
                    <div>
                        <LabelComp>Last Calibrated At</LabelComp>
                        <Input type="datetime-local" {...register('last_calibrated_at')} />
                        {errors.last_calibrated_at && <span className="text-red-500 text-xs">{errors.last_calibrated_at.message as string}</span>}
                    </div>
                </div>
        </form>
    );
};

export default QuestionBankMutationForm;
