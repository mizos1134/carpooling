import { z } from 'zod';

export const SendOtpSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number too short')
    .max(15, 'Phone number too long')
    .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
});

export type SendOtpDto = z.infer<typeof SendOtpSchema>;

export const VerifyOtpSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?[0-9]+$/),
  code: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]+$/, 'OTP must be numeric'),
});

export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
