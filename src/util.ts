// @deno-types='../mod.d.ts'

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

/** Checks if an URL is valid, also checks URL is provided with HTTP(S). */
export function isValidUrl(url: string) {
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

/** Checks if string contains HTTP(S). */
function containsHttpString(url: string) {
  return /(http|https)?:\/\/(\S+)/.test(url) ?? false;
}

export function stripHttpString(url: string) {
  return containsHttpString(url) ? url.split('://')[1] : url;
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
  const shortUrl = stripHttpString(url);
  return `https://websitecarbon.com/website/${slugify(shortUrl)}`;
}
