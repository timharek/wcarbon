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
    return result;
  }

  return {
    green: result.green,
    size: `${(result.bytes / 1024).toFixed(1)} kB`,
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: `${result.statistics.energy} kW_g`,
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
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

function noArgs(flags: Args) {
  return Object.values(flags).every(
    (flag) => flag === false || flag === undefined || flag.length === 0,
  );
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

if (FLAGS.url) {
  console.log(await querySite(FLAGS.url, options.format));
}

if (FLAGS.bytes) {
  console.log(
    await queryData(FLAGS.bytes, FLAGS.green ? 1 : 0, options.format),
  );
}
