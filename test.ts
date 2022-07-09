import { assertEquals, assertFalse, assertThrows } from 'https://deno.land/std@0.147.0/testing/asserts.ts';
import { calculateSize, calculateEnergy, isValidUrl } from './src/helpers.ts'

Deno.test('Verify that 1024 B returns 1 kB', () => {
  const initialSize = 1024;

  const calculatedSize = calculateSize(initialSize);

  assertEquals(calculatedSize, '1 kB');
})

Deno.test('Verify that 2097152 B returns 2.0 MB', () => {
  const initialSize = 2097152;

  const calculatedSize = calculateSize(initialSize);

  assertEquals(calculatedSize, '2 MB');
})

Deno.test('Verify that 8589934592 B returns 8.0 GB', () => {
  const initialSize = 8589934592;

  const calculatedSize = calculateSize(initialSize);

  assertEquals(calculatedSize, '8 GB');
})

Deno.test('Verify that `https://example.org` is a valid URL', () => {
  const url = 'https://example.org';

  assertEquals(isValidUrl(url), true);
})

Deno.test('Verify that `example.org` is a valid URL', () => {
  const url = 'example.org';

  assertEquals(isValidUrl(url), true);
})

Deno.test('Verify that `https://example` is not a valid URL', () => {
  const url = 'https://example';

  assertFalse(isValidUrl(url));
})

Deno.test('Verify that `0.1` (kW /g) returns `100 W /g`', () => {
  const initialEnergy = 0.1;

  const calculatedEnergyString = calculateEnergy(initialEnergy);

  assertEquals(calculatedEnergyString, '100.0 W /g');
})

Deno.test('Verify that `2.10023` (kW /g) returns `2.1 kW /g`', () => {
  const initialEnergy = 2.10023;

  const calculatedEnergyString = calculateEnergy(initialEnergy);

  assertEquals(calculatedEnergyString, '2.1 kW /g');
})

