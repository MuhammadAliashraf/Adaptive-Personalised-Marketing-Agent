import postmark from "postmark";

const client = new postmark.ServerClient(
  process.env.POSTMARK_SERVER_TOKEN!
);

export async function sendCampaignEmail(
  to: string,
  subject: string,
  htmlBody: string
) {
  return await client.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: subject,
    HtmlBody: htmlBody,
  });
}