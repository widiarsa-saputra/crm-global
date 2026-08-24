// src/auth/schema/loginDataSchema.ts
import { z } from "zod";

// Skema ini sekarang mendefinisikan payload yang diterima oleh API.
// Keduanya (email dan username) bersifat opsional, karena hanya salah satu yang akan dikirim.
const apiLoginPayloadSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string(), // Password selalu dibutuhkan
});

export default apiLoginPayloadSchema;

// Ini adalah tipe yang akan kita gunakan di hook useLogin
export type ApiLoginPayload = z.infer<typeof apiLoginPayloadSchema>;