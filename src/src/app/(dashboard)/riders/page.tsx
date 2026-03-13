"use client";

// Issue #8 — Vista de flota de repartidores

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bike, Phone, Plus, X, Circle } from "lucide-react";

type RiderStatus = "disponible" | "en_ruta" | "inactivo";

interface Rider {
  _id: string;
  name: string;
  phone: string;
  status: RiderStatus;
}

const STATUS_CONFIG: Record<RiderStatus, { label: string; color: string; dot: string }> = {
  disponible: { label: "Disponible", color: "text-green-700",  dot: "bg-green-500"  },
  en_ruta:    { label: "En ruta",    color: "text-blue-700",   dot: "bg-blue-500"   },
  inactivo:   { label: "Inactivo",   color: "text-gray-500",   dot: "bg-gray-400"   },
};

const STATUS_ORDER: RiderStatus[] = ["disponible", "en_ruta", "inactivo"];

export default function RidersPage() {
  const { data: session } = useSession();
  const businessId = (session?.user as any)?.businessId as string | undefined;

  const [riders, setRiders]     = useState<Rider[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: "", phone: "" });
  const [saving, setSaving]     = useState(false);

  async function fetchRiders() {
    if (!businessId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/riders?businessId=${businessId}`);
      const data = await res.json();
      setRiders(Array.isArray(data) ? data : []);
    } catch {
      setRiders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRiders(); }, [businessId]);

  async function changeStatus(id: string, status: RiderStatus) {
    await fetch(`/api/riders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchRiders();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/riders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, businessId }),
      });
      setForm({ name: "", phone: "" });
      setShowForm(false);
      fetchRiders();
    } finally {
      setSaving(false);
    }
  }

  const byStatus = (s: RiderStatus) => riders.filter((r) => r.status === s);

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            C
          </div>
          <h1 className="text-lg font-semibold">Flota de repartidores</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar repartidor
        </button>
      </header>

      <main className="p-6">

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {STATUS_ORDER.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = byStatus(s).length;
            return (
              <div key={s} className="rounded-xl border bg-card p-4 flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${cfg.dot}`} />
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Cargando repartidores...</p>
        ) : riders.length === 0 ? (
          <div className="text-center py-16">
            <Bike className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No hay repartidores registrados.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-primary underline"
            >
              Agregar el primero
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {riders.map((rider) => {
              const cfg = STATUS_CONFIG[rider.status];
              return (
                <div key={rider._id} className="rounded-xl border bg-card p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {rider.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rider.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {rider.phone}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
                      <Circle className="h-2 w-2 fill-current" />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Cambiar estado */}
                  <div className="flex gap-2">
                    {STATUS_ORDER.filter((s) => s !== rider.status).map((s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(rider._id, s)}
                        className="flex-1 rounded-md border border-input text-xs py-1.5 hover:bg-accent transition-colors"
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal agregar repartidor */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card border shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold">Nuevo repartidor</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej: Carlos Rodríguez"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Teléfono *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="310 000 0000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-md border border-input py-2 text-sm hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
