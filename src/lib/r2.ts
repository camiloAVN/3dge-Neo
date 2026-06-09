import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
  // Prevents SDK v3 from auto-adding CRC32 checksum headers that R2
  // doesn't support in presigned PUT requests from the browser.
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
} satisfies S3ClientConfig);

export const R2_BUCKET     = process.env.R2_BUCKET_NAME ?? '';
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '';
