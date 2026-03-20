import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const runs = await prisma.leadGenerationRun.findMany({ orderBy: { createdAt: "desc" }, include: { leads: true }, take: 100 });
  return NextResponse.json({ runs });
}
