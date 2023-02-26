// @deno-types='../mod.d.ts'

import { Colors } from '../deps.ts';
import { querySite } from './wcarbon.ts';

/**
 * Helper fetch-function.
 * @param url The URL to be fetched
 * @returns
 */
export async function _fetch(url: URL): Promise<unknown> {
  return await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
}

/**
 *  Calculate the size of a
 *
 * @param number to a human-readable format.
 * @returns string
 */
export function calculateSize(number: number): string {
  // Sizes in bytes
  const kB = 1024;
  const MB = kB * kB;
  const GB = MB * kB;

  if (number > GB) {
    return `${getSizeString(number, GB)} GB`;
  } else if (number > MB) {
    return `${getSizeString(number, MB)} MB`;
  }

  return `${getSizeString(number, kB)} kB`;
}

function getSizeString(number: number, unit: number): string {
  return `${Number((number / unit).toFixed(1))}`;
}

/**
 *  Calculate the energy of an
 *
 * @param amount to a human-readable format.
 * @returns string
 */
export function calculateEnergy(amount: number): string {
  if (amount > 1) {
    return `${amount.toFixed(1)} kW /g`;
  }

  return `${(amount * 1000).toFixed(1)} W /g`;
}

/**
 * Checks if an URL is valid, also checks URL is provided with HTTP(S).
 *
 * @returns boolean
 */
export function isValidUrl(url: string): boolean {
  // Checks if there is a period in case there is no TLD provided.
  if (!/\./.test(url)) {
    console.error(
      '%cDid you forget to provide a TLD?',
      'color: white; background-color: red; font-weight: bold',
    );
    return false;
  }
  try {
    if (!containsHttpString(url)) {
      url = `https://${url}`;
    }
    new URL(url);
    return true;
  } catch (_err) {
    console.error(
      '%cInvalid URL',
      'color: white; background-color: red; font-weight: bold',
    );
    return false;
  }
}

/**
 * Checks if string contains HTTP(S).
 *
 * @returns boolean
 */
function containsHttpString(url: string): boolean {
  return /(http|https)?:\/\/(\S+)/.test(url) ?? false;
}

export function stripHttpString(url: string): string {
  return containsHttpString(url) ? url.split('://')[1] : url;
}

/**
 * Slugify a string. Ex. `example.org` becomes `example-org`
 *
 * @param text String to slugified
 * @return string slugified
 */
function slugify(text: string): string {
  return text
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\./g, '-') // Replace spaces with -
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

/**
 * Get's URL for Website Carbon to see results based on provided
 *
 * @param url
 * @returns string
 */
export function getWebsiteCarbonUrl(url: string): string {
  const shortUrl = stripHttpString(url);
  return `https://websitecarbon.com/website/${slugify(shortUrl)}`;
}

export async function getSiteResults(
  url: string,
  json: boolean,
): Promise<string> {
  const result = await querySite(url);

  if (!json) {
    if (result.green === true) {
      return Colors.black(
        Colors.bgGreen(
          `Hurrah! ${url} is is cleaner than ${
            result.cleanerThan * 100
          }% of web pages tested.`,
        ),
      );
    } else {
      return Colors.black(
        Colors.bgRed(
          `Uh oh! ${url} is is dirtier than ${
            result.cleanerThan * 100
          }% of web pages tested.`,
        ),
      );
    }
  }

  return JSON.stringify(result, null, 2);
}
