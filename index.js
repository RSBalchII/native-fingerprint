const path = require('path');
const bindingPath = path.join(__dirname, 'build/Release/fingerprint.node');
const binding = require(bindingPath);

/**
 * Generate 64-bit SimHash as hex string
 * @param {string} text - Input text to fingerprint
 * @returns {string} - 16-character hex string representing the fingerprint
 */
function fingerprint(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return binding.fingerprint(text);
}

/**
 * Calculate Hamming distance between two fingerprints
 * @param {string} hashA - First fingerprint as hex string
 * @param {string} hashB - Second fingerprint as hex string
 * @returns {number} - Distance between the two fingerprints (0-64)
 */
function distance(hashA, hashB) {
  if (typeof hashA !== 'string' || typeof hashB !== 'string') {
    throw new TypeError('Both inputs must be hex strings');
  }
  return binding.distance(hashA, hashB);
}

/**
 * Check if two texts are near-duplicates (distance < threshold)
 * @param {string} textA - First text to compare
 * @param {string} textB - Second text to compare
 * @param {number} [threshold=3] - Maximum distance to consider duplicates
 * @returns {boolean} - True if texts are considered duplicates
 */
function isDuplicate(textA, textB, threshold = 3) {
  if (typeof textA !== 'string' || typeof textB !== 'string') {
    throw new TypeError('Both inputs must be strings');
  }
  if (typeof threshold !== 'number' || threshold < 0) {
    throw new TypeError('Threshold must be a non-negative number');
  }
  return binding.isDuplicate(textA, textB, threshold);
}

module.exports = {
  fingerprint,
  distance,
  isDuplicate
};