import { z } from '../deps.ts';

const statistics = z.object({
  adjustedBy: z.number().optional(),
  energy: z.number(),
  co2: z.object({
    grid: z.object({
      grams: z.number(),
      litres: z.number(),
    }),
    renewable: z.object({
      grams: z.number(),
      litres: z.number(),
    }),
  }),
});

export const SiteResponse = z.object({
  url: z.string().url(),
  green: z.boolean().or(z.literal('unknown')),
  bytes: z.number(),
  cleanerThan: z.number(),
  statistics,
  timestamp: z.number(),
});

export const DataResponse = z.object({
  cleanerThan: z.number(),
  statistics,
});

export type SiteResponse = z.infer<typeof SiteResponse>;
export type DataResponse = z.infer<typeof DataResponse>;

const co2 = z.object({
  grid: z.string(),
  renewable: z.string(),
});

export type CO2 = z.infer<typeof co2>;
