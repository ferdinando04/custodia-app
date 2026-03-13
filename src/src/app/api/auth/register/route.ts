// POST /api/auth/register — crear cuenta de negocio
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { businessName, email, password } = await req.json();

    if (!businessName || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos: businessName, email, password" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ businessName, email, password: hashed });

    return NextResponse.json(
      { id: user._id.toString(), email: user.email, businessName: user.businessName },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
