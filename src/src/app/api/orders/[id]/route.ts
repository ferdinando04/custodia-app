// Issue #7 — PATCH /api/orders/[id] — cambiar status y/o asignar repartidor
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

// PATCH /api/orders/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const { status, riderId } = body;

    const validStatuses = ["pendiente", "en_camino", "entregado", "cancelado"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status inválido. Opciones: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (riderId !== undefined) update.riderId = riderId;

    const updated = await Order.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/orders/[id]:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// DELETE /api/orders/:id — cancelar pedido (soft: cambia status a cancelado)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status: "cancelado" },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("DELETE /api/orders/[id]:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
