import { z } from 'zod';

export const loginErrorMessages = {
  emailRequired: '이메일을 입력해주세요.',
  emailFormat: '이메일 형식이 올바르지 않아요.',
  passwordRequired: '비밀번호를 입력해주세요.',
} as const;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, loginErrorMessages.emailRequired)
    .pipe(z.email(loginErrorMessages.emailFormat)),
  password: z.string().min(1, loginErrorMessages.passwordRequired),
});

export type LoginValues = z.infer<typeof loginSchema>;
