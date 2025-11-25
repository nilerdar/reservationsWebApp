'use server';

import { supabaseServer } from '@/lib/supabaseServer';
import { Resend } from 'resend';
import {
    autoReservationSchema,
    type AutoReservationInput,
} from '@/lib/validation/reservation';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function createAutoReservation(formData: FormData) {
    // 1) Mapear FormData -> objeto plano
    const raw = {
        date: String(formData.get('date') ?? ''),
        time: String(formData.get('time') ?? ''),
        people: Number(formData.get('people') ?? 0),
        name: String(formData.get('name') ?? ''),
        phone: (formData.get('phone') as string) ?? undefined,
        email: (formData.get('email') as string) ?? undefined,
        notes: (formData.get('notes') as string) ?? undefined,
    };

    // 2) Validar con Zod en el servidor
    const parsed = autoReservationSchema.safeParse(raw);

    if (!parsed.success) {
        const flat = parsed.error.flatten();
        const firstMessage =
            flat.formErrors[0] ||
            Object.values(flat.fieldErrors).flat()[0] ||
            'Datos de reserva no válidos';

        return { ok: false, error: firstMessage };
    }

    const values: AutoReservationInput = parsed.data;

    // 3) Insertar reserva en Supabase
    const { data: reservation, error } = await supabaseServer
        .from('reservations')
        .insert({
            date: values.date,
            time: values.time,
            people: values.people,
            customer_name: values.name,
            customer_phone: values.phone ?? null,
            customer_email: values.email ?? null,
            notes: values.notes ?? null,
            mode: 'auto',
            table_id: null,
            status: 'pending',
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        return { ok: false, error: 'No se ha podido crear la reserva.' };
    }

    // 4) Email del owner desde settings
    const { data: settings } = await supabaseServer
        .from('settings')
        .select('owner_email')
        .eq('id', 1)
        .single();

    const ownerEmail = settings?.owner_email || process.env.OWNER_FALLBACK_EMAIL;

    // 5) Email al cliente
    if (values.email && resend) {
        try {
            await resend.emails.send({
                from: 'Reservas <reservas@tu-dominio.com>',
                to: values.email,
                subject: `Confirmación de reserva - ${values.date} ${values.time}`,
                html: `
          <p>Hola ${values.name},</p>
          <p>Tu reserva se ha registrado correctamente.</p>
          <ul>
            <li>Fecha: ${values.date}</li>
            <li>Hora: ${values.time}</li>
            <li>Personas: ${values.people}</li>
            <li>Modo: Asignación automática de mesa</li>
          </ul>
          <p>Si necesitas modificar o cancelar, contacta con el restaurante.</p>
        `,
            });
        } catch (e) {
            console.error('Error enviando email al cliente', e);
        }
    }

    // 6) Email al owner
    if (ownerEmail && resend) {
        try {
            await resend.emails.send({
                from: 'Reservas <reservas@tu-dominio.com>',
                to: ownerEmail,
                subject: `Nueva reserva (auto) - ${values.date} ${values.time}`,
                html: `
          <p>Nueva reserva modo AUTO:</p>
          <ul>
            <li>Nombre: ${values.name}</li>
            <li>Teléfono: ${values.phone || 'No proporcionado'}</li>
            <li>Email: ${values.email || 'No proporcionado'}</li>
            <li>Fecha: ${values.date}</li>
            <li>Hora: ${values.time}</li>
            <li>Personas: ${values.people}</li>
            <li>Notas: ${values.notes || '-'}</li>
          </ul>
        `,
            });
        } catch (e) {
            console.error('Error enviando email al owner', e);
        }
    }

    return { ok: true, reservation };
}
