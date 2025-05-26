import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with your actual database
const mockBoxes = [
  {
    _id: "1",
    nombre: "Traditional Japanese Sweets",
    pais: "Japan",
    descripcion: "A carefully curated selection of Japanese candies, desserts, and teas from local makers",
    imagen: "/placeholder.svg?height=400&width=600",
    precio: 25,
    productos: ["Pocky Sticks", "KitKat Matcha", "Mochi", "Dorayaki"],
  },
  {
    _id: "2",
    nombre: "Italian Dessert Box",
    pais: "Italy",
    descripcion: "Multiple traditional snacks from Italy including chocolates and biscotti",
    imagen: "/placeholder.svg?height=400&width=600",
    precio: 30,
    productos: ["Biscotti", "Amaretti", "Cannoli Chips", "Espresso Chocolate"],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const box = mockBoxes.find((b) => b._id === params.id)

  if (!box) {
    return NextResponse.json({ error: "Box not found" }, { status: 404 })
  }

  return NextResponse.json(box)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const boxIndex = mockBoxes.findIndex((b) => b._id === params.id)

    if (boxIndex === -1) {
      return NextResponse.json({ error: "Box not found" }, { status: 404 })
    }

    mockBoxes[boxIndex] = { ...mockBoxes[boxIndex], ...body }

    return NextResponse.json(mockBoxes[boxIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update box" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const boxIndex = mockBoxes.findIndex((b) => b._id === params.id)

  if (boxIndex === -1) {
    return NextResponse.json({ error: "Box not found" }, { status: 404 })
  }

  mockBoxes.splice(boxIndex, 1)

  return NextResponse.json({ message: "Box deleted successfully" })
}
