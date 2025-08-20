import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../utils";
import prisma from "@/app/prisma";
import { Rating } from "@/generated/prisma";

const mapToRating = (rating: number): Rating => {
  switch (rating) {
    case 4:
      return Rating.VERY_NICE;
    case 3:
      return Rating.SOMEWHAT_NICE;
    case 2:
      return Rating.NEITHER_NICE_NOR_MEAN;
    case 1:
      return Rating.SOMEWHAT_MEAN;
    case 0:
      return Rating.VERY_MEAN;
    case -1:
      return Rating.SKIPPED;
    default:
      throw new Error(
        `Expected rating to map from [0, 4] but instead found ${rating}`
      );
  }
};

export async function POST(request: NextRequest) {
  const sessionId = await getSession();
  const data = await request.json();

  const { id, rating } = data.rating;

  const sanitizedRating = mapToRating(rating);

  const pony = await prisma.ponyRating.findFirst({
    where: {
      sessionId,
      ponyId: id,
    },
  });

  if (pony) {
    return NextResponse.json(
      { message: "You've already rated this horse!" },
      {
        status: 400,
      }
    );
  }

  await prisma.ponyRating.create({
    data: {
      sessionId,
      rating: sanitizedRating,
      ponyId: id,
    },
  });


  return NextResponse.json({
    message: `Thank you for your submission for ${id} of ${rating}!`,
  });
}
