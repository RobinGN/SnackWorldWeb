import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { correo, contrasena } = body

    // Mock authentication - replace with your actual auth logic
    if (correo === "admin@snackworld.com" && contrasena === "admin123") {
      const token = "mock-jwt-token-" + Date.now()
      return NextResponse.json({ token })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
