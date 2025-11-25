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
        .optional()
        .or(z.literal('').transform(() => undefined)),
    notes: z
        .string()
        .max(500, 'Máximo 500 caracteres')
        .optional()
        .or(z.literal('').transform(() => undefined)),
}).superRefine((val, ctx) =>{
    const dateTimeStr = `${val.date}T${val.time}`;
    const dateTime = new Date(dateTimeStr);

    if (Number.isNaN(dateTime.getTime())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Fecha u hora no válidas',
            path: ['date'],
        });
        return;
    }

    const now = new Date();

    if (dateTime < now) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'No puedes reservar en el pasado',
            path: ['date'],
        });
    }
});

export type AutoReservationInput = z.infer<typeof autoReservationSchema>;
