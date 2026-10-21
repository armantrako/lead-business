/**
 * Instagram URL and Username Sanitation & Validation Service
 * 
 * Rules:
 * 1. Extract genuine username from raw handle or URL
 * 2. Remove '@', query parameters, fragments, trailing slashes
 * 3. Generate canonical direct URL: https://www.instagram.com/USERNAME/
 * 4. Comprehensive logging to pinpoint extraction or format errors
 */

export interface InstagramUrlResult {
  rawInput: string;
  cleanUsername: string;
  canonicalUrl: string;
  isValid: boolean;
  error?: string;
}

export function sanitizeAndValidateInstagramUrl(rawInput: string): InstagramUrlResult {
  if (!rawInput || typeof rawInput !== 'string') {
    console.error('[Instagram Service] Extraction failed: Input is empty or not a string.');
    return {
      rawInput: rawInput || '',
      cleanUsername: '',
      canonicalUrl: '',
      isValid: false,
      error: 'Empty or invalid input',
    };
  }

  const trimmed = rawInput.trim();

  // Step 1: Remove full Instagram URL prefixes if present
  let username = trimmed
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^http:\/\/(www\.)?instagram\.com\//i, '');

  // Step 2: Remove URL parameters, query strings, and hashes (?igsh=..., #...)
  username = username.split('?')[0].split('#')[0];

  // Step 3: Remove leading '@' characters and trailing/leading slashes and whitespace
  username = username.replace(/^@+/, '').replace(/\/+$/, '').trim();

  // Step 4: Validate Instagram username criteria:
  // - 1 to 30 characters
  // - Allowed characters: letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_)
  // - Cannot start or end with a period, cannot have consecutive periods
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;

  if (!usernameRegex.test(username) || username.startsWith('.') || username.endsWith('.') || username.includes('..')) {
    console.error(`[Instagram Service] Validation failed for handle: "${username}" (derived from "${rawInput}")`);
    return {
      rawInput,
      cleanUsername: username,
      canonicalUrl: '',
      isValid: false,
      error: `Invalid Instagram username format: "${username}"`,
    };
  }

  // Step 5: Build canonical direct profile URL
  const canonicalUrl = `https://www.instagram.com/${username}/`;

  return {
    rawInput,
    cleanUsername: username,
    canonicalUrl,
    isValid: true,
  };
}
