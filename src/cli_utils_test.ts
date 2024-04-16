import { assertEquals } from 'https://deno.land/std@0.223.0/assert/mod.ts';
import { dataOutput, siteOutput } from './cli_utils.ts';

Deno.test('Test site example.org', async () => {
  const result = await siteOutput('example.org', {});

  console.log(result);
  assertEquals(result.includes('Hurrah!'), true);
});

Deno.test('Data with 2 MB and no green hosting', async () => {
  const result = await dataOutput({ bytes: 2000000, hasGreenHosting: false });

  assertEquals(result.includes('cleanerThan'), true);
});
