import prisma from "@/app/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../utils";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const sessionId = await getSession()

  const dataPolicy = await prisma.dataPolicy.findFirst({
    where: {
      sessionId
    },
  });

  if (!dataPolicy) {
    return NextResponse.json({ agreed: false }, { status: 200 });
  }

  return NextResponse.json({ agreed: dataPolicy.accepted }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const sessionId = await getSession();

  const { agreed } = await request.json();

  await prisma.dataPolicy.upsert({
    where: { sessionId  },
    update: { accepted: agreed ?? false},
    create: {
      sessionId,
      accepted: agreed ?? false
    },
  });

  return NextResponse.json({ agreed }, { status: 200 });
}
