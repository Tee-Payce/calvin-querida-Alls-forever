import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
  max: 1,
  prepare: false, // required for Supabase transaction pooler (pgBouncer)
});

export interface Rsvp {
  id: number;
  full_name: string;
  attendance: string;
  partner_name: string | null;
  contact: string;
  dietary: string | null;
  song: string | null;
  submitted_at: string;
}

export async function insertRsvp(data: Omit<Rsvp, "id" | "submitted_at">) {
  const rows = await sql<{ id: number }[]>`
    INSERT INTO rsvps (full_name, attendance, partner_name, contact, dietary, song)
    VALUES (${data.full_name}, ${data.attendance}, ${data.partner_name}, ${data.contact}, ${data.dietary}, ${data.song})
    RETURNING id
  `;
  return rows[0];
}

export async function getAllRsvps() {
  const rows = await sql<Rsvp[]>`SELECT * FROM rsvps ORDER BY submitted_at DESC`;
  return rows;
}
