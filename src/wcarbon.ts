import { DataResponse, SiteResponse } from './schemas.ts';
import {
  _fetch,
  calculateEnergy,
  calculateSize,
  getWebsiteCarbonUrl,
  isValidUrl,
} from './util.ts';

const REQUEST_URL = 'https://api.websitecarbon.com';

export async function site(
  siteURL: string | URL,
): Promise<SiteResponse | null> {
  if (!isValidUrl(siteURL)) {
    console.error('Invalid URL');
    return null;
  }

  const url = new URL(`${REQUEST_URL}/site?url=${siteURL}`);

  const response = await _fetch(url);

  try {
    const result = SiteResponse.parse(response);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type DataRequest = {
  bytes: number;
  hasGreenHosting: boolean;
};

export async function data(
  { bytes, hasGreenHosting }: DataRequest,
): Promise<DataResponse | null> {
  const url = new URL(
    `${REQUEST_URL}/data?bytes=${bytes}&green=${+hasGreenHosting}`,
  );

  const response = await _fetch(url);

  try {
    const result = DataResponse.parse(response);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

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
  const { bytes, hasGreenHosting } = request;
  const requestUrl = new URL(`${REQUEST_URL}/data`);
  requestUrl.searchParams.set('bytes', `${bytes}`);
  requestUrl.searchParams.set('green', `${hasGreenHosting}`);

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
