import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
  bio: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
  preferredLanguage: z.enum(['fr', 'en', 'ar']).optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
