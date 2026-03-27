export type LeadInput = {
  niche: string;
  location: string;
  serviceOffer: string;
  businessType: string;
  keywords: string;
  tone: string;
  count?: number;
};

export type GeneratedLead = {
  businessName: string;
  website: string;
  email: string;
  phone: string;
  notes: string;
  leadScore: number;
  outreachEmail: string;
  followUpEmail: string;
};
