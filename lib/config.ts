import { z } from "zod";

export const THEME_COOKIE_NAME = 'theme';

export const firstNameSchema = z.string().min(1, {
    message: 'First name cannot be empty.'
});
export const lastNameSchema = z.string().min(1, {
    message: 'Last name cannot be empty.'
});
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8, {
    message: 'Password must be at least 8 characters long.'
}).regex(/[A-Z]/, {
    message: 'Password must contain an uppercase letter.'
}).regex(/[a-z]/, {
    message: 'Password must contain a lowercase letter.'
}).regex(/[0-9]/, {
    message: 'Password must contain a number.'
}).regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain a special character.'
})

export const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})
