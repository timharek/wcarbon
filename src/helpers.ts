import { Args } from '../deps.ts';

/** Calculate the size of a @param number to a human-readable format. */
export function calculateSize(number: number) {
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

/** Calculate the energy of an @param amount to a human-readable format. */
export function calculateEnergy(amount: number) {
  if (amount > 1) {
    return `${amount.toFixed(1)} kW /g`;
  }

  return `${(amount * 1000).toFixed(1)} W /g`;
}

/** Returns true if no argmuments are provided. */
export function noArgs(flags: Args) {
  return Object.values(flags).every(
    (flag) => flag === false || flag === undefined || flag.length === 0,
  );
}

/** Checks if an URL is valid, also checks URL is provided with HTTP(S). */
export function isValidUrl(url: string) {
  try {
    if (!/(http|https)?:\/\/(\S+)/.test(url)) {
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

/** Slugify a string. Ex. `example.org` becomes `example-org` */
export function slugify(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\./g, '-') // Replace spaces with -
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

/** Get's URL for Website Carbon to see results based on provided @param url */
export function getWebsiteCarbonUrl(url: string) {
  return `https://websitecarbon.com/website/${slugify(url)}`;
}

