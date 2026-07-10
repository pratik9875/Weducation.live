// Manual UPI fee collection — a stopgap until Razorpay is connected (spec §10).
// Generates a standard UPI deep link / QR per payment; there is no gateway
// callback, so an admin or finance staffer confirms receipt manually via the
// payments status dropdown once the transfer lands in the account.

import QRCode from "qrcode";

export interface GenerateUpiLinkParams {
  amount: number; // in rupees
  note: string;
  transactionRefId: string;
}

function assertConfigured() {
  if (!process.env.UPI_ID) {
    throw new Error("UPI_ID is not configured");
  }
}

export function generateUpiLink(params: GenerateUpiLinkParams): string {
  assertConfigured();

  const query = new URLSearchParams({
    pa: process.env.UPI_ID!,
    pn: process.env.UPI_PAYEE_NAME ?? "",
    am: params.amount.toFixed(2),
    cu: "INR",
    tn: params.note,
    tr: params.transactionRefId,
  });

  return `upi://pay?${query.toString()}`;
}

export async function generateUpiQrDataUrl(upiLink: string): Promise<string> {
  return QRCode.toDataURL(upiLink, { margin: 1, width: 240 });
}
