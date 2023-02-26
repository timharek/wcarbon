declare namespace WebsiteCarbon {
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
}

interface DataRequest {
  bytes: number;
  green: 1 | 0;
}

declare namespace WCarbon {
  interface ISite {
    green: WebsiteCarbon.SiteResponse['green'];
    size: string;
    cleanerThan: string;
    energy_pr_load: string;
    co2: ICO2;
    time: string;
    wcarbonUrl: string;
  }

  interface IData {
    cleanerThan: string;
    energy_pr_load: string;
    co2: ICO2;
  }

  interface ICO2 {
    grid: string;
    renewable: string;
  }
}
