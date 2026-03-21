import { NextResponse } from "next/server";
import { generateLeadsWithAI } from "@/lib/lead-generator";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const run = await prisma.leadGenerationRun.create({
      data: {
        niche: body.niche,
        location: body.location,
        serviceOffer: body.serviceOffer,
        businessType: body.businessType,
        keywords: body.keywords,
        tone: body.tone
      }
    });

    const leads = await generateLeadsWithAI(body);

    await prisma.lead.createMany({
      data: leads.map((lead) => ({
        ...lead,
        runId: run.id
      }))
    });

    return NextResponse.json({ runId: run.id, leads });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate leads", details: String(error) }, { status: 500 });
  }
}
