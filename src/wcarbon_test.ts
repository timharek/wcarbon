import { assertEquals, assertExists } from '../deps.ts';
import { data, site } from './wcarbon.ts';

Deno.test('Test site example.org', async () => {
  const result = await site('example.org');

  assertExists(result);
  assertEquals(result.url, 'https://example.org/');
});

Deno.test('Data with 2 MB and no green hosting', async () => {
  const result = await data({ bytes: 2000000, hasGreenHosting: false });

  assertExists(result);
  assertEquals(result.cleanerThan, 0.48);
});

Deno.test('Data with 2 MB and green hosting', async () => {
  const result = await data({ bytes: 2000000, hasGreenHosting: true });

  assertExists(result);
  assertEquals(result.cleanerThan, 0.54);
});
