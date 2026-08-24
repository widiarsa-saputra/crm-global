import { z } from "zod";

const CreateSegmentSchema = z.object({
    name: z.string().min(1, "Segment name is required"),
});

export { CreateSegmentSchema };
export type CreateSegment = z.infer<typeof CreateSegmentSchema>;
