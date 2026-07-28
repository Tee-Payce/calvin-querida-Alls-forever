import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { z } from "zod";
import { insertRsvp, getAllRsvps } from "@/lib/db";
import { sendRsvpEmail } from "@/lib/email";

const schema = z.object({
  fullName:    z.string().trim().min(2).max(100),
  attendance:  z.enum(["accept", "decline"]),
  partnerName: z.string().trim().max(100).optional().or(z.literal("")),
  contact:     z.string().trim().min(5).max(150),
  dietary:     z.string().trim().max(300).optional().or(z.literal("")),
  song:        z.string().trim().max(150).optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rsvps = await getAllRsvps();
  return NextResponse.json(rsvps);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const d = parsed.data;

  try {
    const row = await insertRsvp({
      full_name:    d.fullName,
      attendance:   d.attendance,
      partner_name: d.partnerName || null,
      contact:      d.contact,
      dietary:      d.dietary     || null,
      song:         d.song        || null,
    });

    sendRsvpEmail({
      full_name:    d.fullName,
      attendance:   d.attendance,
      partner_name: d.partnerName || null,
      contact:      d.contact,
      dietary:      d.dietary     || null,
      song:         d.song        || null,
    }).catch((err) => console.error("[email] Failed:", err));

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    console.error("[rsvp] POST failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
