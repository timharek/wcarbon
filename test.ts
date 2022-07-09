import { assertEquals, assertFalse } from 'https://deno.land/std@0.147.0/testing/asserts.ts';
import { calculateSize, isValidUrl } from './src/helpers.ts'

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
