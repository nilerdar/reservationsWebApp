'use client';

import { useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { AutoReservationInput } from '@/lib/validation/reservation';

type Props = {
    onSubmit: (values: AutoReservationInput) => Promise<{ ok: boolean }>;
};

export function AutoReservationForm({ onSubmit }: Props) {
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const router = useRouter();

    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const values: AutoReservationInput = {
            date: String(formData.get('date') || ''),
            time: String(formData.get('time') || ''),
            people: Number(formData.get('people') || 0),
            name: String(formData.get('name') || ''),
            phone: (formData.get('phone') as string) || undefined,
            email: (formData.get('email') as string) || undefined,
            notes: (formData.get('notes') as string) || undefined,
        };

        startTransition(async () => {
            const result = await onSubmit(values);

            if (!result.ok) {
                router.push('/reserve/auto?error=1');
            } else {
                router.push('/reserve/auto?success=1');
                form.reset();
            }
        });
    }

    return (
        <div className="flex flex-col gap-4 p-6 bg-white border rounded-xl shadow max-w-md w-full">
            <h1 className="text-xl font-semibold mb-2">Reserva rápida</h1>

            {errorParam && (
                <p className="text-sm text-red-600">
                    Ha habido un error al crear la reserva. Inténtalo de nuevo.
                </p>
            )}
            {successParam && (
                <p className="text-sm text-green-700">
                    Reserva creada correctamente.
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span>Fecha</span>
                    <input
                        type="date"
                        name="date"
                        required
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Hora</span>
                    <input
                        type="time"
                        name="time"
                        required
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Personas</span>
                    <input
                        type="number"
                        name="people"
                        min={1}
                        required
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Nombre</span>
                    <input
                        type="text"
                        name="name"
                        required
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Teléfono</span>
                    <input
                        type="tel"
                        name="phone"
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Email (para confirmación)</span>
                    <input
                        type="email"
                        name="email"
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Notas</span>
                    <textarea
                        name="notes"
                        className="border px-2 py-1 rounded"
                    />
                </label>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 px-4 py-2 rounded-lg font-medium border bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                >
                    {isPending ? 'Creando reserva…' : 'Confirmar reserva'}
                </button>
            </form>
        </div>
    );
}
