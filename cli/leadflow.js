#!/usr/bin/env node

const { Command } = require("commander");
const { stringify } = require("csv-stringify/sync");
const fs = require("fs");

async function generateWithMock(options) {
  const count = Number(options.count || 10);
  return Array.from({ length: count }, (_, idx) => {
    const i = idx + 1;
    return {
      businessName: `${options.location} ${options.niche} Lead ${i}`,
      website: `https://www.${options.niche.toLowerCase().replace(/\s+/g, "")}${i}.com`,
      email: `hello${i}@${options.niche.toLowerCase().replace(/\s+/g, "")}${i}.com`,
      phone: `+1-555-000-${String(i).padStart(2, "0")}`,
      notes: `Potential fit for ${options.service}`,
      leadScore: 60 + i,
      outreachEmail: `Hi there, we help ${options.niche} businesses with ${options.service}. Open to quick ideas?`,
      followUpEmail: `Checking in again—can I send a short action plan to improve your lead flow?`
    };
  });
}

const program = new Command();
program
  .name("leadflow")
  .description("LeadFlow AI CLI")
  .version("1.0.0");

program
  .command("generate")
  .requiredOption("--niche <niche>")
  .requiredOption("--location <location>")
  .requiredOption("--service <service>")
  .option("--count <count>", "Number of leads", "10")
  .option("--output <output>", "Output CSV file", "leadflow-leads.csv")
  .action(async (options) => {
    const leads = await generateWithMock(options);
    const csv = stringify(leads, { header: true });
    fs.writeFileSync(options.output, csv);

    console.log(`Saved ${leads.length} leads to ${options.output}`);
    leads.forEach((lead) => {
      console.log(`\n${lead.businessName} (Score: ${lead.leadScore})`);
      console.log(`Outreach: ${lead.outreachEmail}`);
      console.log(`Follow-up: ${lead.followUpEmail}`);
    });
  });

program.parse(process.argv);
