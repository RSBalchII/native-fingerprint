# @rbalchii/native-fingerprint

Near-duplicate detection using SimHash

## Installation

```bash
npm install @rbalchii/native-fingerprint
```

## Usage

```javascript
const { fingerprint, distance, isDuplicate } = require('@rbalchii/native-fingerprint');

// Generate a fingerprint for text
const fp1 = fingerprint('Hello world');
const fp2 = fingerprint('Hello world!'); // Similar text
const fp3 = fingerprint('Goodbye universe'); // Different text

console.log(fp1); // Outputs a 16-character hex string
console.log(fp2);
console.log(fp3);

// Calculate the distance between fingerprints
const dist1 = distance(fp1, fp2); // Small distance for similar texts
const dist2 = distance(fp1, fp3); // Large distance for different texts

console.log(dist1); // Number between 0-64
console.log(dist2); // Number between 0-64

// Check if two texts are duplicates based on a threshold
const isSimilar = isDuplicate('Hello world', 'Hello world!', 5);
console.log(isSimilar); // true if distance < threshold

// Default threshold is 3:
// - < 3 = likely duplicate
// - 3-10 = similar 
// - > 10 = different
```

## API

### `fingerprint(text: string): string`
Generates a 64-bit SimHash signature as a 16-character hex string.

### `distance(hashA: string, hashB: string): number`
Calculates the Hamming distance between two fingerprints (0-64).

### `isDuplicate(textA: string, textB: string, threshold?: number): boolean`
Checks if two texts are near-duplicates based on the distance threshold (default: 3).

## Use Case

Great for RAG deduplication - efficiently identify and filter out near-duplicate content in large document collections.