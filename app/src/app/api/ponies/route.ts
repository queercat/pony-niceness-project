import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../utils";
import { isPageStatic } from "next/dist/build/utils";
import prisma from "@/app/prisma";
import { Pony } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  const sessionId = await getSession();

  const ratingsFromThisIp = await prisma.ponyRating.findMany({
    where: {
      sessionId
    },
  });

  const count = ratingsFromThisIp.length;
  const totalPonies = await prisma.pony.count();

  if (count >= totalPonies || true) {
    return NextResponse.json(
      { message: "You have rated all available ponies." },
      { status: 404 }
    );
  }

  const pony = (
    (await prisma.$queryRaw`
      SELECT "Pony"."id", "Pony"."derpiUrl", "Pony"."name" FROM "Pony"
      LEFT JOIN "PonyRating" ON "PonyRating"."ponyId" = "Pony"."id" AND "PonyRating"."sessionId" = ${sessionId}
      WHERE "PonyRating"."id" IS NULL
      ORDER BY RANDOM()
      LIMIT 1
    `) as Pony[]
  )[0];

  const random = Math.random() * 100;

  return NextResponse.json({
    pony,
    message: random > 99 ? "i love you" : "Pony got!",
  });
}
