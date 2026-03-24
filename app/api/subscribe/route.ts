import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_LOTA_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await resend.contacts.create({
      email,
      audienceId: process.env.AUDIENCE_ID!,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
