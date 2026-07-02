// Razorpay fee collection (spec §4). The AI Admission Assistant never processes
// payment directly — it always hands off to a secure link generated here.

import Razorpay from "razorpay";
import crypto from "crypto";

function getClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export interface CreatePaymentLinkParams {
  applicationId: string;
  amount: number; // in rupees
  studentName: string;
  studentPhone: string;
  description: string;
}

export async function createPaymentLink(params: CreatePaymentLinkParams) {
  const client = getClient();

  return client.paymentLink.create({
    amount: Math.round(params.amount * 100), // paise
    currency: "INR",
    description: params.description,
    customer: {
      name: params.studentName,
      contact: params.studentPhone,
    },
    notify: { sms: true, email: false },
    reference_id: params.applicationId,
    notes: { application_id: params.applicationId },
  });
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
