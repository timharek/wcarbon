/**
 * Access Website Carbon's API for checking carbon emissions for websites.
 *
 * ## Example for site
 * ```ts
 * import { querySite } from 'https://deno.land/x/wcarbon/mod.ts';
 *
 * const domain = 'example.org';
 * const result = querySite(domain);
 * ```
 *
 * ## Example for data
 * ```ts
 * import { queryData } from 'https://deno.land/x/wcarbon/mod.ts';
 *
 * const bytes = '1024';
 * const result = queryData(bytes);
 * ```
 * @module
 */

export { queryData, querySite } from './src/wcarbon.ts';
