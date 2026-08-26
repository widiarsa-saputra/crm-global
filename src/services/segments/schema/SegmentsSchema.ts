import { z } from "zod";
import { optionalMinString } from "@/lib/zod";

const CreateSegmentSchema = z.object({
    name: z.string().min(1, "Segment name is required"),
});

export { CreateSegmentSchema };

export type CreateSegment = z.infer<typeof CreateSegmentSchema>;

const UpdateSegmentSchema = z.object({
    name: optionalMinString(1, "Segment name is required"),
});

export { UpdateSegmentSchema };

export type UpdateSegment = z.infer<typeof UpdateSegmentSchema>;
