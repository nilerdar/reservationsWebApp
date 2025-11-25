import { supabaseServer } from '@/lib/supabaseServer';

type Reservation = {
    id: string;
    date: string;
    time: string;
    people: number;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    mode: 'auto' | 'map';
    status: 'pending' | 'confirmed' | 'cancelled' | 'seated';
    notes: string | null;
};

function getTodayDateString() {
    const now = new Date();
    // YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default async function AdminPage() {
    const today = getTodayDateString();

    const { data, error } = await supabaseServer
        .from('reservations')
        .select(
            'id, date, time, people, customer_name, customer_phone, customer_email, mode, status, notes'
        )
        .eq('date', today)
        .order('time', { ascending: true });

    if (error) {
        console.error(error);
    }

    const reservations = (data || []) as Reservation[];

    return (
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">
                    Reservas de hoy ({today})
                </h1>

                {reservations.length === 0 ? (
                    <p className="text-slate-600">
                        No hay reservas para hoy.
                    </p>
                ) : (
                    <div className="overflow-x-auto bg-white border rounded-xl shadow">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-100">
                            <tr>
                                <th className="px-3 py-2 text-left">Hora</th>
                                <th className="px-3 py-2 text-left">Nombre</th>
                                <th className="px-3 py-2 text-left">Personas</th>
                                <th className="px-3 py-2 text-left">Teléfono</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Modo</th>
                                <th className="px-3 py-2 text-left">Estado</th>
                                <th className="px-3 py-2 text-left">Notas</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reservations.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2 align-top">
                                        {r.time.slice(0, 5)}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        {r.customer_name}
                                    </td>
                                    <td className="px-3 py-2 align-top">{r.people}</td>
                                    <td className="px-3 py-2 align-top">
                                        {r.customer_phone || '-'}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        {r.customer_email || '-'}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        {r.mode === 'auto' ? 'Auto' : 'Mapa'}
                                    </td>
                                    <td className="px-3 py-2 align-top capitalize">
                                        {r.status}
                                    </td>
                                    <td className="px-3 py-2 align-top max-w-xs">
                                        {r.notes || '-'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
