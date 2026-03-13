// PATCH /api/riders/:id — cambiar estado del repartidor
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Rider from "@/lib/models/Rider";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    const valid = ["disponible", "en_ruta", "inactivo"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: `status inválido. Opciones: ${valid.join(", ")}` }, { status: 400 });
    }

    const updated = await Rider.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Repartidor no encontrado" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/riders/[id]:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
