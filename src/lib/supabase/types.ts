export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ReportRow = {
  id: string;
  created_by: string;
  type: "Tala ilegal" | "Incendio" | "Contaminación";
  description: string;
  location_hint: string;
  contact_email: string | null;
  created_at: string;
};

export type LeaderboardRow = {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
};

export type LeaderboardBestRow = {
  user_id: string;
  best_score: number;
  created_at: string;
  updated_at: string;
};

export type CertificateRow = {
  id: string;
  user_id: string;
  display_name: string;
  score: number | null;
  is_public: boolean;
  storage_path: string | null;
  public_url?: string | null;
  created_at: string;
};

