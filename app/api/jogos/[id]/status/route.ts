import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { status } = await req.json();

    const updatedMatch = await prisma.match.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ message: "Status atualizado!", match: updatedMatch });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json({ error: "Erro ao atualizar status." }, { status: 500 });
  }
}