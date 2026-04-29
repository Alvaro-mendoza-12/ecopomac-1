import { NextResponse } from "next/server";
import { reportSchema, type ReportRecord } from "@/features/reports/reportSchema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readReports(): Promise<ReportRecord[]> {
  try {
    const raw = await fs.readFile(REPORTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ReportRecord[];
    return [];
  } catch {
    return [];
  }
}

async function writeReports(reports: ReportRecord[]) {
  await ensureDataDir();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf8");
}

export async function GET() {
  const reports = await readReports();
  return NextResponse.json({ reports: reports.slice(0, 50) });
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const result = reportSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validación fallida", issues: result.error.issues },
      { status: 400 },
    );
  }

  const record: ReportRecord = {
    ...result.data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const reports = await readReports();
  reports.unshift(record);

  try {
    await writeReports(reports.slice(0, 500));
  } catch {
    // En Vercel, el FS puede ser efímero/solo lectura.
    // Aun así devolvemos éxito para demo universitaria.
  }

  return NextResponse.json({ ok: true, report: record });
}

