import { z } from "zod";

export const reportSchema = z.object({
  type: z.enum(["Tala ilegal", "Incendio", "Contaminación"]),
  description: z.string().min(10).max(800),
  locationHint: z.string().min(3).max(160),
  contact: z.string().email().optional().or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportSchema>;

export type ReportRecord = ReportInput & {
  id: string;
  createdAt: string;
};

export type ReportDbRow = {
  id: string;
  created_by: string;
  type: ReportInput["type"];
  description: string;
  location_hint: string;
  contact_email: string | null;
  created_at: string;
};

