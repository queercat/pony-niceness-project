import fs from "fs";

import { PrismaClient } from "../src/generated/prisma/client";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

const prisma = new PrismaClient();

async function main() {
  const file = await readFile("./prisma/seed/data.csv", "utf-8");
  const lines = file.split("\n").slice(1);

  const derpiUrl = "https://derpibooru.org";
  const imagesApi = "/api/v1/json/images/";

  const convertToDirectLink = async (url: string) => {
    const imageId = url.split("/").pop();
    const response = await fetch(derpiUrl + imagesApi + imageId, {
      headers: {
        "User-Agent": "Pony Niceness Project (i love horse butt)",
      },
    });
    const data = await response.json();

    return data.image.representations.large as string;
  };

  const batchSize = 30;
  for (let i = 0; i < lines.length; i += batchSize) {
    const batch = lines.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (line) => {
        const [name, url, rating, color] = line.split(",");

        const directLink = await convertToDirectLink(url);

        console.log(`Seeding pony: ${name} ${url} ${rating} ${color}`);

        return prisma.pony.create({
          data: {
            name: name.trim(),
            derpiUrl: directLink,
            baseAlignment: rating.trim().toUpperCase() as
              | "GOOD"
              | "NEUTRAL"
              | "BAD",
            primaryColor: color.trim(),
          },
        });
      })
    );
    if (i + batchSize < lines.length) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  await prisma.$disconnect();
}

main();
