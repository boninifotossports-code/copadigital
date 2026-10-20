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
        { error: "Não autorizado. Faça login para continuar." },
        { status: 401 }
      );
    }

    const { eventType, playerId, minute, period, teamType } = await req.json();

    if (!eventType || minute === undefined) {
      return NextResponse.json(
        { error: "Tipo de evento e minuto são obrigatórios." },
        { status: 400 }
      );
    }

    const matchId = params.id;

    // Registrar o evento na partida
    const event = await prisma.matchEvent.create({
      data: {
        matchId,
        playerId: playerId || null,
        eventType,
        minute: Number(minute),
        period: period || "1T",
      },
      include: {
        player: true,
      },
    });

    // Se o evento for gol, atualiza o placar da partida
    if (eventType === "GOL") {
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (match) {
        if (teamType === "home") {
          await prisma.match.update({
            where: { id: matchId },
            data: { homeScore: match.homeScore + 1 },
          });
        } else if (teamType === "away") {
          await prisma.match.update({
            where: { id: matchId },
            data: { awayScore: match.awayScore + 1 },
          });
        }
      }
    }

    return NextResponse.json({ message: "Evento registrado!", event }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar evento:", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar evento do jogo." },
      { status: 500 }
    );
  }
}