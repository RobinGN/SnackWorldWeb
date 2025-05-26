import { NextResponse, type NextRequest } from "next/server"

// Mock users data - replace with actual database
const mockUsuarios = [
  {
    _id: "user1",
    nombre: "Carlos López",
    correo: "carlos@example.com",
    fechaRegistro: "2024-01-15T00:00:00.000Z",
    suscripcionActiva: true,
  },
  {
    _id: "user2",
    nombre: "María García",
    correo: "maria@example.com",
    fechaRegistro: "2024-02-20T00:00:00.000Z",
    suscripcionActiva: true,
  },
  {
    _id: "user3",
    nombre: "Juan Pérez",
    correo: "juan@example.com",
    fechaRegistro: "2024-03-10T00:00:00.000Z",
    suscripcionActiva: false,
  },
  {
    _id: "user4",
    nombre: "Ana Martínez",
    correo: "ana@example.com",
    fechaRegistro: "2024-03-25T00:00:00.000Z",
    suscripcionActiva: true,
  },
  {
    _id: "user5",
    nombre: "Luis Rodriguez",
    correo: "luis@example.com",
    fechaRegistro: "2024-04-05T00:00:00.000Z",
    suscripcionActiva: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Calculate stats
    const totalUsers = mockUsuarios.length
    const totalSubscriptions = mockUsuarios.filter((user) => user.suscripcionActiva).length

    // Calculate total value based on active subscriptions
    const averageSubscriptionValue = 45
    const totalValue = totalSubscriptions * averageSubscriptionValue

    return NextResponse.json({
      totalUsers,
      totalSubscriptions,
      totalValue,
      usuarios: mockUsuarios,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get admin stats" }, { status: 500 })
  }
}
