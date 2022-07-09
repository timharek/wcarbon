// @deno-types='../mod.d.ts'
import { calculateSize, calculateEnergy, getWebsiteCarbonUrl } from './helpers.ts';
import { REQUEST_URL } from '../config.ts'

export async function _fetch(url: URL) {
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

export async function querySite(url: string, format: string) {
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
    energy_pr_load: calculateEnergy(result.statistics.energy),
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
    time: `${new Date().toISOString()}`,
    wcarbonUrl: getWebsiteCarbonUrl(url),
  };
}

export async function queryData(bytes: string, green: number, format: string) {
  const requestUrl = new URL(`${REQUEST_URL}/data`);
  requestUrl.searchParams.set('bytes', `${bytes}`);
  requestUrl.searchParams.set('green', `${green}`);

  const result = (await _fetch(requestUrl)) as DataResponse;

  if (format == 'long') {
    return result;
  }

  return {
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: calculateEnergy(result.statistics.energy),
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
  };
}

