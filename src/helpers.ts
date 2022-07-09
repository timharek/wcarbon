import { Args } from '../deps.ts';

export function calculateSize(number: number) {
  const MB = 1000;
  const GB = 1000 * MB;

  const size = Number((number / 1024).toFixed(1));

  if (size > MB) {
    return `${(size / MB).toFixed(1)} MB`;
  } else if (size > GB) {
    return `${(size / GB).toFixed(1)} GB`;
  }

  return `${size} kB`;
}

export function calculateEnergy(amount: number) {
  if (amount > 1) {
    return `${amount.toFixed(1)} kW /g`;
  }

  return `${(amount * 1000).toFixed(1)} W /g`;
}

export function noArgs(flags: Args) {
  return Object.values(flags).every(
    (flag) => flag === false || flag === undefined || flag.length === 0,
  );
}

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

export function getWebsiteCarbonUrl(url: string) {
  return `https://websitecarbon.com/website/${slugify(url)}`;
}

