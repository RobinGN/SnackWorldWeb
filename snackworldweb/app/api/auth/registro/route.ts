import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, correo, contrasena } = body

    // Mock registration - replace with your actual registration logic
    console.log("Registering user:", { nombre, correo })

    return NextResponse.json({ mensaje: "Usuario registrado con éxito" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
