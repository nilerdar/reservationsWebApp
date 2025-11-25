import { z } from 'zod';

export const autoReservationSchema = z.object({
    date: z.string().min(1, 'La fecha es obligatoria'),
    time: z.string().min(1, 'La hora es obligatoria'),
    people: z
        .number()
        .int()
        .min(1, { message: 'Mínimo 1 persona' })
        .max(20, { message: 'Demasiadas personas para una sola reserva' }),
    name: z.string().min(1, 'El nombre es obligatorio').max(100),
    phone: z
        .string()
        .max(30)
        .optional()
        .or(z.literal('').transform(() => undefined)),
    email: z
        .string()
        .email('Email no válido')
        .or(z.literal('').transform(() => undefined)),
    notes: z
        .string()
        .max(500, 'Máximo 500 caracteres')
        .optional()
        .or(z.literal('').transform(() => undefined)),
}).superRefine((val, ctx) => {
    // Comprobar solo que el día no sea anterior a hoy (en UTC)
    if (!val.date) return;

    const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    if (val.date < todayStr) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'No puedes reservar en días pasados',
            path: ['date'],
        });
    }
});

export type AutoReservationInput = z.infer<typeof autoReservationSchema>;
