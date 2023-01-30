// @deno-types='../mod.d.ts'

import { Colors } from '../deps.ts';
import {
  calculateEnergy,
  calculateSize,
  getWebsiteCarbonUrl,
  isValidUrl,
} from './util.ts';

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

export async function querySite(url: string, verbose: number) {
  if (!isValidUrl(url)) {
    console.error('Invalid URL');
    Deno.exit(-1);
  }

  const requestUrl = new URL(`${REQUEST_URL}/site`);
  requestUrl.searchParams.set('url', url);

  const result = (await _fetch(requestUrl)) as SiteResponse;

  if (verbose < 1) {
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
  } else if (verbose === 1) {
    return {
      green: result.green,
      size: calculateSize(result.bytes),
      cleanerThan: `${result.cleanerThan * 100}%`,
      energy_pr_load: calculateEnergy(result.statistics.energy),
      co2: {
        grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
        renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
      },
      time: `${new Date().toISOString()}`,
      wcarbonUrl: getWebsiteCarbonUrl(url),
    };
  } else {
    return { ...result, wcarbonUrl: getWebsiteCarbonUrl(url) };
  }
}

export async function queryData(request: DataRequest, verbose: number) {
  const { bytes, green } = request;
  const requestUrl = new URL(`${REQUEST_URL}/data`);
  requestUrl.searchParams.set('bytes', `${bytes}`);
  requestUrl.searchParams.set('green', `${green}`);

  const result = (await _fetch(requestUrl)) as DataResponse;

  if (verbose >= 1) {
    return result;
  } else {
    return {
      cleanerThan: `${result.cleanerThan * 100}%`,
      energy_pr_load: calculateEnergy(result.statistics.energy),
      co2: {
        grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
        renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
      },
    };
  }
}
