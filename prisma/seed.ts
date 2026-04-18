import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const copa = await prisma.product.upsert({
    where: { slug: "copa-2026" },
    update: {},
    create: {
      name: "Copa do Mundo 2026",
      slug: "copa-2026",
      description: "FIFA World Cup 2026 — USA, Canada & Mexico",
      isActive: true,
      categories: {
        create: [
          {
            name: "Resultados dos jogos",
            description: "Placar exato de cada partida",
            type: "exact_score",
            resultSource: "api",
            sortOrder: 1,
          },
          {
            name: "Vencedor da copa",
            description: "Selecao campea do torneio",
            type: "single_choice",
            resultSource: "api",
            sortOrder: 2,
          },
          {
            name: "Artilheiro",
            description: "Jogador com mais gols no torneio",
            type: "free_text",
            resultSource: "api",
            sortOrder: 3,
          },
          {
            name: "Primeiro, segundo e terceiro lugar",
            description: "Podio de selecoes",
            type: "single_choice",
            resultSource: "api",
            sortOrder: 4,
          },
          {
            name: "Jogador revelacao",
            description: "Nome do jogador destaque do torneio",
            type: "free_text",
            resultSource: "api",
            sortOrder: 5,
          },
        ],
      },
    },
  });

  console.log(`Product created/found: ${copa.name} (${copa.id})`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
