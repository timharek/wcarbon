// @deno-types='../mod.d.ts'

import {
  _fetch,
  calculateEnergy,
  calculateSize,
  getWebsiteCarbonUrl,
  isValidUrl,
} from './util.ts';

const REQUEST_URL = 'https://api.websitecarbon.com';

export async function querySite(url: string): Promise<WCarbon.ISite> {
  if (!isValidUrl(url)) {
    console.error('Invalid URL');
    Deno.exit(-1);
  }

  const requestUrl = new URL(`${REQUEST_URL}/site`);
  requestUrl.searchParams.set('url', url);

  const response = (await _fetch(requestUrl)) as WebsiteCarbon.SiteResponse;

  return {
    green: response.green,
    size: calculateSize(response.bytes),
    cleanerThan: `${response.cleanerThan * 100}%`,
    energy_pr_load: calculateEnergy(response.statistics.energy),
    co2: {
      grid: `${response.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${response.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
    time: `${new Date().toISOString()}`,
    wcarbonUrl: getWebsiteCarbonUrl(url),
  } as WCarbon.ISite;
}

export async function queryData(request: DataRequest): Promise<WCarbon.IData> {
  const { bytes, green } = request;
  const requestUrl = new URL(`${REQUEST_URL}/data`);
  requestUrl.searchParams.set('bytes', `${bytes}`);
  requestUrl.searchParams.set('green', `${green}`);

  const result = (await _fetch(requestUrl)) as WebsiteCarbon.DataResponse;

  return {
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: calculateEnergy(result.statistics.energy),
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
  } as WCarbon.IData;
}
