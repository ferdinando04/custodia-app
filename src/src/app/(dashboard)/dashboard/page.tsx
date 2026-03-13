"use client";

// Issue #6 — Tablero Kanban de pedidos

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Phone, MapPin, Package, Plus, X, ChevronRight, CheckCircle, XCircle } from "lucide-react";

type OrderStatus = "pendiente" | "en_camino" | "entregado" | "cancelado";

interface Order {
  _id: string;
  clienteName: string;
  clientePhone: string;
  address: string;
  items: string;
  total?: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

const COLUMNS: { status: OrderStatus; label: string; color: string; bg: string }[] = [
  { status: "pendiente", label: "Pendiente", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  { status: "en_camino", label: "En camino", color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"   },
  { status: "entregado", label: "Entregado", color: "text-green-700",  bg: "bg-green-50 border-green-200" },
];

const NEXT_STATUS: Record<string, OrderStatus | null> = {
  pendiente: "en_camino",
  en_camino: "entregado",
  entregado: null,
};

const ACTION_LABEL: Record<string, string> = {
  pendiente: "Despachar",
  en_camino: "Marcar entregado",
};

const emptyForm = {
  clienteName: "",
  clientePhone: "",
  address: "",
  items: "",
  total: "",
  notes: "",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const businessId = (session?.user as any)?.businessId as string | undefined;

  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  async function fetchOrders() {
    if (!businessId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?businessId=${businessId}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, [businessId]);

  async function advanceOrder(id: string, currentStatus: OrderStatus) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    fetchOrders();
  }

  async function cancelOrder(id: string) {
    if (!confirm("¿Cancelar este pedido?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) return;
    setSaving(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total: form.total ? Number(form.total) : undefined,
          businessId,
        }),
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchOrders();
    } finally {
      setSaving(false);
    }
  }

  const byStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status);

  const hour = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            C
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">Panel de despacho</h1>
            {session?.user?.name && (
              <p className="text-xs text-muted-foreground mt-0.5">{session.user.name}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo pedido
        </button>
      </header>

      {/* Kanban */}
      <main className="p-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Cargando pedidos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(({ status, label, color, bg }) => {
              const col = byStatus(status);
              return (
                <div key={status} className={`rounded-xl border-2 ${bg} flex flex-col`}>

                  <div className="px-4 py-3 border-b border-current/10 flex items-center justify-between">
                    <span className={`font-semibold text-sm ${color}`}>{label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 ${color}`}>
                      {col.length}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col gap-3 flex-1">
                    {col.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-8">Sin pedidos</p>
                    )}
                    {col.map((order) => (
                      <div key={order._id} className="bg-white rounded-lg border border-border shadow-sm p-3 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm leading-tight">{order.clienteName}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{hour(order.createdAt)}</span>
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-start gap-1.5">
                            <Phone className="h-3 w-3 mt-0.5 shrink-0" />
                            <span>{order.clientePhone}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{order.address}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Package className="h-3 w-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{order.items}</span>
                          </div>
                          {order.total && (
                            <p className="font-semibold text-foreground">
                              ${order.total.toLocaleString("es-CO")}
                            </p>
                          )}
                        </div>

                        {NEXT_STATUS[status] && (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => advanceOrder(order._id, status)}
                              className="flex-1 flex items-center justify-center gap-1 rounded-md bg-primary text-primary-foreground text-xs py-1.5 hover:bg-primary/90 transition-colors"
                            >
                              <ChevronRight className="h-3 w-3" />
                              {ACTION_LABEL[status]}
                            </button>
                            {status === "pendiente" && (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="rounded-md border border-destructive text-destructive text-xs px-2 py-1.5 hover:bg-destructive/10 transition-colors"
                                title="Cancelar"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                        {status === "entregado" && (
                          <div className="flex items-center gap-1 text-xs text-green-600 pt-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Completado</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal nuevo pedido */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-card border shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold">Nuevo pedido</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre del cliente *</label>
                  <input
                    required
                    value={form.clienteName}
                    onChange={(e) => setForm({ ...form, clienteName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ej: María García"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Teléfono *</label>
                  <input
                    required
                    value={form.clientePhone}
                    onChange={(e) => setForm({ ...form, clientePhone: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="310 000 0000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Total ($)</label>
                  <input
                    type="number"
                    value={form.total}
                    onChange={(e) => setForm({ ...form, total: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="25000"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Dirección *</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Cra 80 #51-23, Bosa"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Productos *</label>
                  <textarea
                    required
                    rows={2}
                    value={form.items}
                    onChange={(e) => setForm({ ...form, items: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="2 pollos asados, 3 Coca-Colas"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Notas (opcional)</label>
                  <input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Sin picante, timbre apto 302..."
                  />
                </div>
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
                  {saving ? "Guardando..." : "Crear pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
