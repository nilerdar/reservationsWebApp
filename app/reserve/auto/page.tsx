import { Suspense } from "react";
import { AutoReservationForm } from './AutoReservationForm';
import { createAutoReservation } from './actions';
import type { AutoReservationInput } from '@/lib/validation/reservation';

async function handleSubmitServer(values: AutoReservationInput) {
    'use server';

    const formData = new FormData();
    formData.set('date', values.date);
    formData.set('time', values.time);
    formData.set('people', String(values.people));
    formData.set('name', values.name);
    if (values.phone) formData.set('phone', values.phone);
    if (values.email) formData.set('email', values.email);
    if (values.notes) formData.set('notes', values.notes);

    const result = await createAutoReservation(formData);

    return { ok: result.ok, error: result.error };
}

export default function AutoReservationPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
            <Suspense fallback={<div>Cargando...</div>}>
                <AutoReservationForm onSubmit={handleSubmitServer} />
            </Suspense>
        </main>
    );
}
