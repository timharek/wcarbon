import { SiteResponse } from './schemas.ts';
import { Colors } from '../deps.ts';
import { data, DataRequest, site, siteCalcuated } from './wcarbon.ts';
import { GlobalOptions } from './cli.ts';

export async function siteOutput(
  siteURL: URL | string,
  { json, calculated }: GlobalOptions,
): Promise<string> {
  const response = await site(siteURL);

  if (!response) {
    return `Unable to find ${siteURL}`;
  }

  if (!json) {
    return cleanOrDirty(response);
  }

  if (!calculated) {
    return JSON.stringify(siteCalcuated(response), null, 2);
  }
  return JSON.stringify(response, null, 2);
}

function getPercentageString(float: number): string {
  return `${float * 100}%`;
}
function cleanOrDirty(site: SiteResponse): string {
  const url = site.url;
  if (site.green === true) {
    return Colors.black(
      Colors.bgGreen(
        `Hurrah! ${url} is is cleaner than ${
          getPercentageString(site.cleanerThan)
        } of web pages tested.`,
      ),
    );
  } else if (site.green === 'unknown') {
    const cleanerThan = site.cleanerThan;
    if (cleanerThan > 0.50) {
      return Colors.black(
        Colors.bgBrightWhite(
          `Hurrah! ${url} is is cleaner than ${
            getPercentageString(site.cleanerThan)
          } of web pages tested.`,
        ),
      );
    }
    return Colors.black(
      Colors.bgRed(
        `Uh oh! ${url} is is dirtier than ${
          getPercentageString(site.cleanerThan)
        } of web pages tested.`,
      ),
    );
  } else {
    return Colors.black(
      Colors.bgRed(
        `Uh oh! ${url} is is dirtier than ${
          getPercentageString(site.cleanerThan)
        } of web pages tested.`,
      ),
    );
  }
}

export async function dataOutput(params: DataRequest): Promise<string> {
  const response = await data(params);

  if (!response) {
    return 'Bad input';
  }

  return JSON.stringify(response, null, 2);
}
