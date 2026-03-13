// API Routes para repartidores
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Rider from "@/lib/models/Rider";

// GET /api/riders?businessId=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const businessId = new URL(req.url).searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId es requerido" }, { status: 400 });
    }
    const riders = await Rider.find({ businessId }).sort({ name: 1 }).lean();
    return NextResponse.json(riders);
  } catch (error) {
    console.error("GET /api/riders:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// POST /api/riders — registrar repartidor
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, phone, businessId } = await req.json();
    if (!name || !phone || !businessId) {
      return NextResponse.json(
        { error: "Faltan campos: name, phone, businessId" },
        { status: 400 }
      );
    }
    const rider = await Rider.create({ name, phone, businessId, status: "disponible" });
    return NextResponse.json(rider, { status: 201 });
  } catch (error) {
    console.error("POST /api/riders:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
