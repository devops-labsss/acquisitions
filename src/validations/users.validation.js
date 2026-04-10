import z from 'zod';

export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Id must be Vaid Number')
    .transform(Number)
    .refine(val => val > 0, 'Id must be a postive number'),
});

export const userUpdateSchema = z
  .object({
    name: z.string().min(2).max(255).trim().optional(),
    email: z.email().max(255).toLowerCase().trim().optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(
    data => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field should be provided for update',
    }
  );
