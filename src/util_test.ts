import { assertEquals, assertFalse } from 'std/testing/asserts.ts';
import {
  calculateEnergy,
  calculateSize,
  getWebsiteCarbonUrl,
  isValidUrl,
  stripHttpString,
} from './util.ts';

Deno.test('Verify that 1024 B returns 1 kB', () => {
  const initialSize = 1024;

  const calculatedSize = calculateSize(initialSize);

  assertEquals(calculatedSize, '1 kB');
});

Deno.test('Verify that 2097152 B returns 2.0 MB', () => {
  const initialSize = 2097152;

  const calculatedSize = calculateSize(initialSize);

  assertEquals(calculatedSize, '2 MB');
});

Deno.test('Verify that 8589934592 B returns 8.0 GB', () => {
  const initialSize = 8589934592;

  const calculatedSize = calculateSize(initialSize);

  assertEquals(calculatedSize, '8 GB');
});

Deno.test('Verify that `https://example.org` is a valid URL', () => {
  const url = 'https://example.org';

  assertEquals(isValidUrl(url), true);
});

Deno.test('Verify that `example.org` is a valid URL', () => {
  const url = 'example.org';

  assertEquals(isValidUrl(url), true);
});

Deno.test('Verify that `https://example` is not a valid URL', () => {
  const url = 'https://example';

  assertFalse(isValidUrl(url));
});

Deno.test('Verify that `0.1` (kW /g) returns `100 W /g`', () => {
  const initialEnergy = 0.1;

  const calculatedEnergyString = calculateEnergy(initialEnergy);

  assertEquals(calculatedEnergyString, '100.0 W /g');
});

Deno.test('Verify that `2.10023` (kW /g) returns `2.1 kW /g`', () => {
  const initialEnergy = 2.10023;

  const calculatedEnergyString = calculateEnergy(initialEnergy);

  assertEquals(calculatedEnergyString, '2.1 kW /g');
});

Deno.test('Verify that `https://` from `https://example.org` is removed', () => {
  const url = 'https://example.org';

  const urlWithoutHttp = stripHttpString(url);

  assertEquals(urlWithoutHttp, 'example.org');
});

Deno.test('Verify that `http://` from `http://example.org` is removed', () => {
  const url = 'http://example.org';

  const urlWithoutHttp = stripHttpString(url);

  assertEquals(urlWithoutHttp, 'example.org');
});

Deno.test('Verify that nothing is removed from URL `example.org`', () => {
  const url = 'example.org';

  const urlWithoutHttp = stripHttpString(url);

  assertEquals(urlWithoutHttp, 'example.org');
});

Deno.test('Verify that `https://example.org` as a Website Carbon link is valid', () => {
  const url = 'https://example.org';

  const wcarbonUrl = getWebsiteCarbonUrl(url);

  assertEquals(wcarbonUrl, 'https://websitecarbon.com/website/example-org');
});

Deno.test('Verify that `http://example.com` as a Website Carbon link is valid', () => {
  const url = 'http://example.com';

  const wcarbonUrl = getWebsiteCarbonUrl(url);

  assertEquals(wcarbonUrl, 'https://websitecarbon.com/website/example-com');
});

Deno.test('Verify that `example.org` as a Website Carbon link is valid', () => {
  const url = 'example.org';

  const wcarbonUrl = getWebsiteCarbonUrl(url);

  assertEquals(wcarbonUrl, 'https://websitecarbon.com/website/example-org');
});
