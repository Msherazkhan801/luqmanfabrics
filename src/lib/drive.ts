/**
 * Google Drive and Image Utility Helper Functions
 * 
 * Supports converting various Google Drive sharing links into direct
 * high-resolution CDN image URLs that Next.js and web browsers can render.
 */

/**
 * Extracts Google Drive file ID from various link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.usercontent.google.com/download?id=FILE_ID
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: id=FILE_ID or ?id=FILE_ID or &id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Pattern 3: googleusercontent.com/d/FILE_ID
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  return null;
}

/**
 * Checks if a given URL is a Google Drive link.
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('drive.google.com') ||
    lower.includes('docs.google.com') ||
    lower.includes('googleusercontent.com/d/')
  );
}

/**
 * Converts a Google Drive link into a direct high-speed CDN image URL.
 * Defaults to Google's lh3.googleusercontent.com/d/{id} direct image endpoint.
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    // High-resolution direct image serving endpoint
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

/**
 * Normalizes any image URL:
 * - If Google Drive: converts to direct CDN image URL
 * - If relative path or standard URL: trims whitespace
 */
export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  if (isGoogleDriveUrl(trimmed)) {
    return convertGoogleDriveUrl(trimmed);
  }

  return trimmed;
}
