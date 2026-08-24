import { z } from "zod";

const CreateSegmentSchema = z.object({
    name: z.string().min(1, "Segment name is required"),
});

export { CreateSegmentSchema };

export type CreateSegment = z.infer<typeof CreateSegmentSchema>;

const UpdateSegmentSchema = z.object({
    name: z.string().min(1, "Segment name is required").optional(),
});

export { UpdateSegmentSchema };

export type UpdateSegment = z.infer<typeof UpdateSegmentSchema>;

