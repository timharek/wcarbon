import { CONFIG, FLAGS } from './config.ts';
import { Args, printHelp } from './deps.ts';

const options = {
  format: 'long',
  type: 'site',
};

interface Statistics {
  adjustedBy: number;
  energy: number;
  co2: {
    grid: {
      grams: number;
      litres: number;
    };
    renewable: {
      grams: number;
      litres: number;
    };
  };
}

interface SiteResponse {
  url: string;
  green: boolean | 'unknown';
  bytes: number;
  cleanerThan: number;
  statistics: Statistics;
  timestamp: number;
}

interface DataResponse {
  cleanerThan: number;
  statistics: Statistics;
}

const REQUEST_URL = 'https://api.websitecarbon.com';

async function _fetch(url: URL) {
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

async function querySite(url: string, format: string) {
  const requestUrl = new URL(`${REQUEST_URL}/site`);
  requestUrl.searchParams.set('url', url);

  const result = (await _fetch(requestUrl)) as SiteResponse;

  if (format == 'long') {
    return { ...result, wcarbonUrl: getWebsiteCarbonUrl(url) };
  }

  return {
    green: result.green,
    size: calculateSize(result.bytes),
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: `${result.statistics.energy} kW_g`,
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
    time: `${new Date().toISOString()}`,
    wcarbonUrl: getWebsiteCarbonUrl(url),
  };
}

async function queryData(bytes: string, green: number, format: string) {
  const requestUrl = new URL(`${REQUEST_URL}/data`);
  requestUrl.searchParams.set('bytes', `${bytes}`);
  requestUrl.searchParams.set('green', `${green}`);

  const result = (await _fetch(requestUrl)) as DataResponse;

  if (format == 'long') {
    return result;
  }

  return {
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: `${result.statistics.energy} kW_g`,
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
  };
}

function calculateSize(number: number) {
  const MB = 1000;
  const GB = 1000 * MB;

  const size = Number((number / 1024).toFixed(1));

  if (size > MB) {
    return `${(size / MB).toFixed(1)} MB`
  } else if (size > GB) {
    return `${(size / GB).toFixed(1)} GB`
  }

  return `${size} kB`
}

function noArgs(flags: Args) {
  return Object.values(flags).every(
    (flag) => flag === false || flag === undefined || flag.length === 0,
  );
}

function isValidUrl(url: string) {
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

function slugify(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\./g, '-') // Replace spaces with -
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function getWebsiteCarbonUrl(url: string) {
  return `https://websitecarbon.com/website/${slugify(url)}`;
}

if (noArgs(FLAGS) || FLAGS.help) {
  printHelp(CONFIG);
  Deno.exit(1);
}

if (FLAGS.version) {
  console.log(CONFIG.version);
  Deno.exit(1);
}

if (FLAGS.short) {
  options.format = 'short';
}

if (FLAGS._) {
  if (FLAGS._.length > 1) {
    console.error(
      '%cToo many arguments',
      'color: white; background-color: red; font-weight: bold',
    );
    Deno.exit(-1);
  }
  const url = String(FLAGS._[0]);

  if (!isValidUrl(url)) {
    Deno.exit(-1);
  }
  console.log(await querySite(url, options.format));
}

if (FLAGS.url) {
  const url = FLAGS.url;
  if (!isValidUrl(url)) {
    Deno.exit(-1);
  }
  console.log(await querySite(url, options.format));
}

if (FLAGS.bytes) {
  console.log(
    await queryData(FLAGS.bytes, FLAGS.green ? 1 : 0, options.format),
  );
}
