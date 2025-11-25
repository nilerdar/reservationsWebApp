import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-3xl w-full px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold mb-2">
                        Sistema de Reservas
                    </h1>
                    <p className="text-slate-600">
                        Gestiona las reservas del restaurante de forma sencilla.
                    </p>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/reserve/auto"
                        className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-lg font-medium mb-1">
                            Reserva rápida
                        </h2>
                        <p className="text-sm text-slate-600">
                            Crea una reserva indicando fecha, hora y número de personas.
                            El local asignará la mesa de forma automática.
                        </p>
                    </Link>

                    <Link
                        href="/admin"
                        className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-lg font-medium mb-1">
                            Panel de administración
                        </h2>
                        <p className="text-sm text-slate-600">
                            Consulta las reservas del día y, más adelante, gestiona el mapa
                            de mesas y el estado de cada reserva.
                        </p>
                    </Link>
                </div>

                <footer className="mt-10 text-center text-xs text-slate-500">
                    Demo · Reservations Web App
                </footer>
            </div>
        </main>
    );
}
