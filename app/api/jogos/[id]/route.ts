import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        homeTeam: {
          include: { players: true },
        },
        awayTeam: {
          include: { players: true },
        },
        events: {
          include: { player: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Partida não encontrada." }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Erro ao buscar partida:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}