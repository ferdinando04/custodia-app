// Issue #7 — API Routes CRUD de pedidos
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

// GET /api/orders?businessId=xxx&status=pendiente
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const status = searchParams.get("status");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId es requerido" },
        { status: 400 }
      );
    }

    const filter: Record<string, string> = { businessId };
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// POST /api/orders — crear pedido nuevo
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { clienteName, clientePhone, address, items, total, notes, businessId } = body;

    if (!clienteName || !clientePhone || !address || !items || !businessId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: clienteName, clientePhone, address, items, businessId" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      clienteName,
      clientePhone,
      address,
      items,
      total,
      notes,
      businessId,
      status: "pendiente",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
