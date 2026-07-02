// Cloudinary handles WhatsApp-sourced document/photo uploads (spec §4.2):
// auto-orient, compress, format-check on upload — no custom validation layer needed.

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type DocumentType = "marksheet" | "id_proof" | "photo" | "certificate";

const UPLOAD_PRESETS: Record<DocumentType, string> = {
  marksheet: "weducation_marksheet",
  id_proof: "weducation_id_proof",
  photo: "weducation_photo",
  certificate: "weducation_certificate",
};

export async function uploadDocument(
  sourceUrl: string,
  documentType: DocumentType,
  applicationId: string,
): Promise<UploadApiResponse> {
  return cloudinary.uploader.upload(sourceUrl, {
    upload_preset: UPLOAD_PRESETS[documentType],
    folder: `applications/${applicationId}/${documentType}`,
    resource_type: "auto",
  });
}

export function getSignedDocumentUrl(publicId: string, expiresInSeconds = 300): string {
  const timestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.url(publicId, {
    sign_url: true,
    type: "authenticated",
    secure: true,
    auth_token: { duration: expiresInSeconds, start_time: timestamp },
  });
}
