import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado. Inicie sessão para continuar." },
        { status: 401 }
      );
    }

    const { name, categories } = await req.json();

    if (!name || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "O nome da competição e pelo menos uma categoria são obrigatórios." },
        { status: 400 }
      );
    }

    // Localizar a organização pertencente ao gestor autenticado
    const org = await prisma.organization.findFirst({
      where: { ownerId: (session.user as any).id },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organização não encontrada para este utilizador." },
        { status: 404 }
      );
    }

    // Criação da competição com as categorias em simultâneo
    const competition = await prisma.competition.create({
      data: {
        name,
        organizationId: org.id,
        status: "DRAFT",
        categories: {
          create: categories.map((cat: { name: string; format: string }) => ({
            name: cat.name,
            format: (cat.format as any) || "PONTOS_CORRIDOS",
          })),
        },
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(
      { message: "Competição criada com sucesso!", competition },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar competição:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a criação da competição." },
      { status: 500 }
    );
  }
}