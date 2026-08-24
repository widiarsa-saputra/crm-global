import { z } from "zod";

const UpdateSegmentSchema = z.object({
    name: z.string().min(1, "Segment name is required").optional(),
});

export { UpdateSegmentSchema };
export type UpdateSegment = z.infer<typeof UpdateSegmentSchema>;
