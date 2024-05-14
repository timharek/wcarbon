import { CO2, DataResponse, SiteResponse } from './schemas.ts';
import {
  _fetch,
  calculateEnergy,
  calculateSize,
  getWebsiteCarbonUrl,
  isValidUrl,
} from './util.ts';

const REQUEST_URL = 'https://api.websitecarbon.com';

/**
 * Calculate the carbon emissions generated per page view.
 *
 * @param siteURL page that you want to calcuate
 * @throws if there is an error with the request
 * @example
 * ```ts
 * import { site } from 'jsr:@timharek/wcarbon';
 *
 * const siteUrl = 'example.org';
 * const result = await site(siteUrl);
 * ```
 */
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

export type DataRequest = {
  bytes: number;
  hasGreenHosting: boolean;
};

/**
 * Calculate the emissions of a page by manually passing the bytes and whether
 * or not it is powered by green hosting.
 *
 * @param data Takes in both `bytes` and `hasGreenHosting` args to calculate the
 * emissions.
 * @throws if there is an error with the request.
 * @example
 * ## Example for data
 * ```ts
 * import { data } from 'jsr:@timharek/wcarbon';
 *
 * const result = await data({bytes: 1024, hasGreenHosting: true});
 * ```
 */
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

export interface SiteCalculated {
  green: boolean | 'unknown';
  size: string;
  cleanerThan: string;
  energy_pr_load: string;
  co2: CO2;
  time: string;
  wcarbonUrl: string;
}
export function siteCalcuated(site: SiteResponse): SiteCalculated {
  return {
    green: site.green,
    size: calculateSize(site.bytes),
    cleanerThan: `${site.cleanerThan * 100}%`,
    energy_pr_load: calculateEnergy(site.statistics.energy),
    co2: {
      grid: `${site.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${site.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
    time: `${new Date().toISOString()}`,
    wcarbonUrl: getWebsiteCarbonUrl(site.url),
  };
}

export type Data = {
  cleanerThan: string;
  energy_pr_load: string;
  co2: CO2;
};

export function dataCalcuated(data: DataResponse): Data {
  return {
    cleanerThan: `${data.cleanerThan * 100}%`,
    energy_pr_load: calculateEnergy(data.statistics.energy),
    co2: {
      grid: `${data.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${data.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
  };
}
