import { NextResponse, type NextRequest } from "next/server"

// Mock users data - in a real app, this would be your database
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userIndex = mockUsuarios.findIndex((user) => user._id === params.id)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove user from mock data
    const deletedUser = mockUsuarios.splice(userIndex, 1)[0]

    return NextResponse.json({
      message: "User deleted successfully",
      deletedUser: deletedUser.nombre,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
