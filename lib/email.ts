import { Resend } from "resend";

interface RsvpEmailData {
  full_name: string;
  attendance: string;
  partner_name?: string | null;
  contact: string;
  dietary?: string | null;
  song?: string | null;
  submitted_at?: string;
}

export async function sendRsvpEmail(data: RsvpEmailData) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const attending = data.attendance === "accept";
  const status = attending ? "✅ Joyfully Accepts" : "❌ Regretfully Declines";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #F8F5F1; border: 1px solid #E5DED5;">
      <h1 style="font-size: 28px; color: #2D2B29; margin: 0 0 4px;">Calvin &amp; Querida</h1>
      <p style="font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #C8A96A; margin: 0 0 24px;">New RSVP Response</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; width: 38%;">Full Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #2D2B29; font-size: 15px;">${data.full_name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Attendance</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #2D2B29; font-size: 15px;">${status}</td>
        </tr>
        ${data.partner_name ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Partner</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #2D2B29; font-size: 15px;">${data.partner_name}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Contact</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #2D2B29; font-size: 15px;">${data.contact}</td>
        </tr>
        ${data.dietary ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Dietary</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #2D2B29; font-size: 15px;">${data.dietary}</td>
        </tr>` : ""}
        ${data.song ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Song Request</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #E5DED5; color: #2D2B29; font-size: 15px;">${data.song}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0; color: #8A847D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Received</td>
          <td style="padding: 10px 0; color: #2D2B29; font-size: 15px;">${data.submitted_at ? new Date(data.submitted_at).toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" }) : new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
        </tr>
      </table>
      <p style="margin-top: 32px; font-size: 12px; color: #8A847D; text-align: center; letter-spacing: 0.2em; text-transform: uppercase;">
        Calvin &amp; Querida · 6 February 2027
      </p>
    </div>
  `;

  await resend.emails.send({
    from: "Calvin & Querida RSVP <onboarding@resend.dev>",
    to: process.env.EMAIL_TO!,
    subject: `RSVP ${attending ? "✅ Accept" : "❌ Decline"} — ${data.full_name}`,
    html,
  });
}
