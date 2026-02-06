const { fingerprint, distance, isDuplicate } = require('./index.js');

console.log('Testing @anchor/native-fingerprint package...\n');

// Test 1: fingerprint("hello world") returns 16-char hex string
console.log('Test 1: fingerprint("hello world") returns 16-char hex string');
const fp1 = fingerprint("hello world");
console.log(`Result: ${fp1}`);
console.log(`Length: ${fp1.length}`);
console.log(`Is 16-char hex string: ${fp1.length === 16 && /^[0-9A-F]+$/.test(fp1)}\n`);

// Test 2: distance(hash1, hash2) returns number 0-64
console.log('Test 2: distance(hash1, hash2) returns number 0-64');
const fp2 = fingerprint("hello world!");
const dist = distance(fp1, fp2);
console.log(`Distance between "hello world" and "hello world!": ${dist}`);
console.log(`Is number between 0-64: ${typeof dist === 'number' && dist >= 0 && dist <= 64}\n`);

// Test 3: Near-identical texts have distance < 5
console.log('Test 3: Near-identical texts have distance < 5');
const fp3 = fingerprint("hello world.");
const dist2 = distance(fp1, fp3);
console.log(`Distance between "hello world" and "hello world.": ${dist2}`);
console.log(`Distance < 5: ${dist2 < 5}\n`);

// Test 4: isDuplicate functionality
console.log('Test 4: isDuplicate functionality');
const dup1 = isDuplicate("hello world", "hello world"); // Same text
const dup2 = isDuplicate("hello world", "hello world!"); // Similar text
const dup3 = isDuplicate("hello world", "goodbye universe"); // Different text
console.log(`Same text is duplicate: ${dup1}`);
console.log(`Similar text is duplicate: ${dup2}`);
console.log(`Different text is duplicate: ${dup3}\n`);

// Test 5: Different texts should have higher distance
console.log('Test 5: Different texts should have higher distance');
const fp4 = fingerprint("goodbye universe");
const dist3 = distance(fp1, fp4);
console.log(`Distance between "hello world" and "goodbye universe": ${dist3}`);
console.log(`Distance is higher than similar texts: ${dist3 > dist}\n`);

console.log('All tests completed!');