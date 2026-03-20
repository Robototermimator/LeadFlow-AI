import OpenAI from "openai";
import { z } from "zod";
import { GeneratedLead, LeadInput } from "@/lib/types";

const leadSchema = z.object({
  leads: z.array(
    z.object({
      businessName: z.string(),
      website: z.string(),
      email: z.string().email(),
      phone: z.string(),
      notes: z.string(),
      leadScore: z.number().min(0).max(100),
      outreachEmail: z.string(),
      followUpEmail: z.string()
    })
  )
});

function buildMockLeads(input: LeadInput): GeneratedLead[] {
  const count = input.count ?? 10;
  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1;
    return {
      businessName: `${input.location} ${input.niche} Prospect ${idx}`,
      website: `https://www.${input.niche.replace(/\s+/g, "").toLowerCase()}${idx}.com`,
      email: `owner${idx}@${input.niche.replace(/\s+/g, "").toLowerCase()}${idx}.com`,
      phone: `+1-555-010-${String(idx).padStart(2, "0")}`,
      notes: `Potential fit for ${input.serviceOffer}. Keywords: ${input.keywords}.`,
      leadScore: Math.min(95, 55 + idx * 4),
      outreachEmail: `Hi ${input.businessType} team, I noticed your ${input.niche} business in ${input.location}. We help with ${input.serviceOffer}. Would you like a quick strategy audit?`,
      followUpEmail: `Following up on my previous note—I'd be happy to send 3 practical ideas to improve your ${input.niche} lead flow this month.`
    };
  });
}

export async function generateLeadsWithAI(input: LeadInput): Promise<GeneratedLead[]> {
  if (!process.env.OPENAI_API_KEY) {
    return buildMockLeads(input);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const count = input.count ?? 10;

  const prompt = `Generate ${count} realistic leads for ${input.niche} in ${input.location}.
Service offer: ${input.serviceOffer}
Target business type: ${input.businessType}
Keywords: ${input.keywords}
Tone: ${input.tone}
Return JSON with {"leads": [...]} where each lead has businessName, website, email, phone, notes, leadScore(0-100), outreachEmail, followUpEmail.`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "lead_generation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            leads: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  businessName: { type: "string" },
                  website: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  notes: { type: "string" },
                  leadScore: { type: "number" },
                  outreachEmail: { type: "string" },
                  followUpEmail: { type: "string" }
                },
                required: ["businessName", "website", "email", "phone", "notes", "leadScore", "outreachEmail", "followUpEmail"],
                additionalProperties: false
              }
            }
          },
          required: ["leads"],
          additionalProperties: false
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  const validated = leadSchema.parse(parsed);
  return validated.leads;
}
