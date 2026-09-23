// Optional: emails the client whenever a new enquiry arrives.
// Deploy:  supabase functions deploy notify-enquiry --no-verify-jwt
// Secrets: supabase secrets set RESEND_API_KEY=... CONTACT_TO=client@email.com WEBHOOK_SECRET=some-long-random-string
// Then: Database > Webhooks > Create: table enquiries, event INSERT, type Supabase Edge Function,
//       function notify-enquiry, add HTTP header  x-webhook-secret: <same WEBHOOK_SECRET>

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { record } = await req.json();
  if (!record) return new Response("No record", { status: 400 });

  const needs = (record.needs ?? []).join(", ") || "Not specified";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Elian Vox site <onboarding@resend.dev>", // switch to hello@yourdomain once verified in Resend
      to: Deno.env.get("CONTACT_TO"),
      reply_to: record.email,
      subject: `Project enquiry from ${record.name}`,
      text: `Name: ${record.name}\nEmail: ${record.email}\nLooking for: ${needs}\n\n${record.message ?? ""}`,
    }),
  });
  return new Response(r.ok ? "sent" : await r.text(), { status: r.ok ? 200 : 502 });
});
