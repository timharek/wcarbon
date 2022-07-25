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

interface DataRequest {
  bytes: number;
  green: 1 | 0;
  verbose: boolean;
}
