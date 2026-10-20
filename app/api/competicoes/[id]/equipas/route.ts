import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado. Inicie sessão." },
        { status: 401 }
      );
    }

    const { name, categoryId } = await req.json();

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Nome da equipa e categoria são obrigatórios." },
        { status: 400 }
      );
    }

    // Criar a equipa associada à categoria indicada
    const team = await prisma.team.create({
      data: {
        name,
        categoryId,
      },
    });

    return NextResponse.json(
      { message: "Equipa registada com sucesso!", team },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar equipa:", error);
    return NextResponse.json(
      { error: "Erro interno ao registar equipa." },
      { status: 500 }
    );
  }
}