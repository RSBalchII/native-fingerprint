/**
 * Generate 64-bit SimHash as hex string
 * @param text Input text to fingerprint
 * @returns 16-character hex string representing the fingerprint
 */
export function fingerprint(text: string): string;

/**
 * Calculate Hamming distance between two fingerprints
 * @param hashA First fingerprint as hex string
 * @param hashB Second fingerprint as hex string
 * @returns Distance between the two fingerprints (0-64)
 */
export function distance(hashA: string, hashB: string): number;

/**
 * Check if two texts are near-duplicates (distance < threshold)
 * @param textA First text to compare
 * @param textB Second text to compare
 * @param threshold Maximum distance to consider duplicates (default: 3)
 * @returns True if texts are considered duplicates
 */
export function isDuplicate(textA: string, textB: string, threshold?: number): boolean;