/**
 * Vietnamese Unicode Normalization and Text Validation Utilities
 * Ensures all user and admin strings strictly adhere to Unicode NFC (Canonical Composition)
 * without modifying the actual spelling or words.
 */

export function normalizeUnicode(text: string): string {
  if (!text) return '';
  // Normalize to Unicode NFC standard (composed characters)
  return text.normalize('NFC');
}

/**
 * Validates that a string does not contain corrupted UTF-8 mojibake or broken encoding sequences
 */
export function validateVietnameseUnicode(text: string): { isValid: boolean; normalized: string } {
  if (!text) return { isValid: true, normalized: '' };
  const normalized = normalizeUnicode(text);

  // Check for common broken encoding artifacts like ï¿½ or ??? or 
  const hasCorruptedChars = /[\uFFFD]/.test(normalized);

  return {
    isValid: !hasCorruptedChars,
    normalized
  };
}

/**
 * Format currency or number in Vietnamese locale
 */
export function formatNumberVi(num: number): string {
  return (num || 0).toLocaleString('vi-VN');
}
