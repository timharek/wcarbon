import { Args, parse } from 'https://deno.land/std@0.145.0/flags/mod.ts';

const options = {
  api: '',
  format: 'long',
  type: 'site',
};

interface Query {
  url?: string;
}

interface SiteResponse {
  url: string;
  green: boolean | 'unknown';
  bytes: number;
  cleanerThan: number;
  statistics: {
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
  };
}

const REQUEST_URL = 'https://api.websitecarbon.com/';

const flags = parse(Deno.args, {
  boolean: ['help', 'short', 'long'],
  string: ['url'],
  alias: { 'url': ['u'], 'short': ['s'], 'long': ['l'], 'help': ['h'] },
});

async function query(query: Query, format: string) {
  let queryUrl = `${REQUEST_URL}${options.type}?`;
  if (options.type === 'site' && query.url) {
    queryUrl += `url=${query.url}`;
  }

  const result = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    }) as SiteResponse;

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

function noArgs(flags: Args) {
  return Object.values(flags).every((flag) =>
    flag === false || flag === undefined || flag.length === 0
  );
}

if (noArgs(flags) || flags.help) {
  console.log('wcarbon 1.0.0');
  console.log('Query webpages (URLs) via Website Carbons API.');
  console.log();
  console.log('%cAUTHOR', 'font-weight: bold', 'Tim Hårek Andreassen <tim@harek.no>');
  console.log('%cSOURCE', 'font-weight: bold', 'https://github.com/timharek/wcarbon');
  console.log();
  console.log('%cUSAGE', 'font-weight: bold', '\n\twcarbon [OPTIONS]');
  console.log();
  console.log('%cOPTIONS', 'font-weight: bold');
  console.log('\t-h, --help     Prints this help message');
  console.log('\t-s, --short    Give the output in the short-format.');
  console.log('\t-l, --long     Give the output in the long-format (default).');
  console.log('\t-u, --url      Test <url> with Website Carbons API and get results in either long- or short-format.');
  console.log();
  console.log('%cEXAMPLES', 'font-weight: bold');
  console.log('\t$ wcarbon -u https://timharek.no');
  console.log('\t$ wcarbon -su https://timharek.no');
  Deno.exit(1);
}

if (flags.short) {
  options.format = 'short';
}

if (flags.url) {
  console.log(await query({ url: flags.url }, options.format));
}
